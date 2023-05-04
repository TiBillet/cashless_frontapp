import { createMachine, assign } from 'xstate'
import { emitEvent } from '@/communs/EmitEvent.js'

const env = import.meta.env

let fetchLoginOptions

// get csrf token
const fetchCsrfToken = (ctx) => fetch('/wv/login_hardware')
  .then(function (response) {
    return response.text()
  })
  .then((html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    ctx.csrfToken = doc.querySelector('input[name="csrfmiddlewaretoken"]').value
    fetchLoginOptions = {
      method: 'POST',
      headers: {
        'X-CSRFToken': ctx.csrfToken
      },
      body: formData
    }
  })

// login
let formData = new FormData()
formData.append('username', env.VITE_USER)
formData.append('password', env.VITE_PASSWORD)
formData.append('periph', env.VITE_FRONT_TYPE)
formData.append('ip_lan', env.VITE_IP_LOCAL)

const fetchLogin = (ctx) => fetch('/wv/login_hardware', fetchLoginOptions)
  .then(async (response) => {
    return { html: await response.text(), status: response.status }
  })
  .then((data) => {
    // console.log('responseText, status =', data.status)
    // console.log('data.html =', data.html)
    // utilisateur existe mais pas activé
    if (data.html.toLowerCase().indexOf('non activé') !== -1 && data.status === 401) {
      // console.log('-> utilisateur existe mais pas activé !')
      ctx.userState = 'created'
    }

    // utilisateur activé = page /wv
    if (data.status === 200) {
      // récupe csrf token
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.html, 'text/html')
      ctx.csrfToken = doc.querySelector('input[name="csrfmiddlewaretoken"]').value
      ctx.userState = 'activated'
    }

  })

// persist state
const initState = {
  userName: env.VITE_USER,
  csrfToken: null,
  errorFetch: null,
  userState: ''
}

export function resetStateMachine () {
  try {
    localStorage.setItem('cashlessState', JSON.stringify(initState))
  } catch (err) {
    console.log('Persist cashless state,', err)
  }
}

// machine
export const cashlessMachine = createMachine({
    id: 'cashless',
    context: initState,
    initial: 'initApp',
    states: {
      initApp: {
        id: 'initAppId',
        on: {
          LOGIN: {
            target: 'getCsrfToken',
            actions: ['loadingActived']
          }
        }
      },
      getCsrfToken: {
        invoke: {
          id: 'getCsrfTokenId',
          src: (context, event) => fetchCsrfToken(context),
          onDone: {
            target: 'createUser',
          },
          onError: {
            actions: ['showMessageError', 'loadingInactived']
          }
        }
      },
      createUser: {
        invoke: {
          id: 'createUserId',
          src: (context, event) => fetchLogin(context),
          onDone: [
            {
              target: 'waitActivation',
              actions: ['loadingInactived'],
              cond: (ctx, event) => {
                return ctx.userState === 'created'
              }
            },
            {
              target: 'readMasterCard',
              actions: ['loadingInactived'],
              cond: (ctx, event) => {
                return ctx.userState === 'activated'
              }
            }
          ],
          onError: {
            actions: ['showMessageError', 'loadingInactived']
          }
        }
      },
      waitActivation: {
        entry: ['askActivationUser']
      },
      readMasterCard: {
        entry: ['showReaderCard']
      },
      directService: {},
      command: {}
    }
  },
  {
    actions: {
      loadingActived: (ctx, event) => {
        console.log('-> loadingActived')
        emitEvent('loading', { value: true })
      },
      loadingInactived: (ctx, event) => {
        console.log('-> loadingInactived')
        emitEvent('loading', { value: false })
      },
      askActivationUser: (ctx, event) => {
        console.log('afficher message "activer utilisateur" !')
        emitEvent('showMessage', {
          title: 'Information',
          type: 'alert-warning',
          message: `Demander à l'administrateur d'activer le périphérique et
          cliquer pour continuer la demande d'activation !`,
          autoRemove: false
        })
      },
      showReaderCard: (ctx, event) => {
        console.log('Afficher le lecteur de carte nfc !')
      },
      showMessageError: (ctx, event) => {
        console.log('-> showMessage, event.data =', event.data)
      }
    },
    guards: {}
  })
