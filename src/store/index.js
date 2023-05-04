import {defineStore} from 'pinia'
import {v4 as uuidv4} from 'uuid'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      gerant: false,
      currentPsId: '',
      articles: [],
      articleClassActive: 'article-class-activetous',
      categories: [],
      ps: [],
      menuPs: [],
      tables: [],
      ip: import.meta.env.VITE_IP_LOCAL,
      user: import.meta.env.VITE_USER,
      url: import.meta.env.VITE_URL,
      frontType: import.meta.env.VITE_FRONT_TYPE,
      loading: false,
      error: false,
      pairing: false,
      csrfToken: '',
      nfc: {
        uuid: '',
        identity: '',
        read: false,
        mode: null
      }
    }
  },
  getters: {
    getArticleClassActive(state) {
      return state.articleClassActive
    },
    getInfosNfc(state) {
      return state.nfc
    },
    getStatusServiceDirect(state) {
      const proxyToArray = JSON.parse(JSON.stringify(state.ps))
      return proxyToArray.find(ps => ps.id === state.currentPsId).service_direct
    },
    getArticleSize(state) {
      return state.articleSize
    }
  },
  actions: {
    setArticleClassActive(event, classe) {
      console.log('event =', event)
      this.articleClassActive = classe
      const listeBtCategorie = document.querySelectorAll('.categories-item')
      for (let i = 0; i < listeBtCategorie.length; i++) {
        listeBtCategorie[i].classList.remove('commande-class-active')
      }
      if (typeof (event) === 'string') {
        document.querySelector('#' + event).classList.add('commande-class-active')
      } else {
        event.target.classList.add('commande-class-active')
      }
    },
    setCurrentPsAndGo(id) {
      this.currentPsId = id
      const proxyToArray = JSON.parse(JSON.stringify(this.ps))
      let currentPs = proxyToArray.find(ps => ps.id === id)

      // ajouter la catégorie "inconnue" si pas de catégorie
      currentPs.articles.map((article) => {
        if (article.categorie === null) {
          article['categorie'] = {
            couleur_backgr: '#8c646b',
            couleur_texte: '#000000',
            icon: 'fa-question',
            id: 'inconnue',
            name: 'inconnue',
            poid_liste: 99999999999
          }
        }
      })

      // console.log('currentPs =', currentPs)
      // articles en cours
      this.articles = currentPs.articles.sort((a, b) => a.poid_liste - b.poid_liste)

      // catégories en cours
      // prends les catégories mais sans doublons
      let refArray =[], categoryArray = []
      currentPs.articles.map(({categorie}) => {
        // console.log('-> getCategory, categorie =', categorie)
        if (refArray.includes(categorie.id) === false) {
          refArray.push(categorie.id)
          categoryArray.push(categorie)
        }
      })
      // filtrer par poid
      categoryArray.sort((a, b) => a.poid_liste - b.poid_liste)
      this.categories = categoryArray

      console.log('Service Direct =', currentPs.service_direct)
      if (currentPs.service_direct === true) {
        this.router.push({path: '/ps'})
      } else {
        this.router.push({path: '/tables/ps'})
      }

    },
    // charge les points de ventes
    // load points of sale
    async loadPointsSale() {
      // const router = useRouter()
      // console.log('-> useAppstore, loadPointsSale !')
      try {
        this.ps = []
        const response = await fetch('/api/pointsSale')
        const retour = await response.json()
        // console.log('response =', response)
        if (response.status === 200) {
          // flitrer les points de vente, poid_liste, du plus petit poid au plus grand
          const filterPs = retour.data.sort((a, b) => a.poid_liste - b.poid_liste)
          // point de vente courant
          this.currentPs = filterPs[0]
          // le menu des points de vente
          this.menuPs = []
          for (const filterPsKey in filterPs) {
            this.menuPs.push({name: filterPs[filterPsKey].name, id: filterPs[filterPsKey].id})
          }
          // enregistrer les points de ventes
          this.ps = retour.data
          console.log('points sale =', this.ps)
          // console.log('currentPs =', this.currentPs)
          // console.log('service_direct =', this.currentPs.service_direct)
          // console.log('menuPs =', this.menuPs)
        } else {
          this.ps = []
        }
      } catch (err) {
        console.error(err);
      }
    },
    // charge les tables
    // load tables
    async loadTables() {
      console.log('-> useAppstore, loadTables !')
      try {
        this.tables = []
        const response = await fetch('/api/tables')
        const retour = await response.json()
        console.log('response =', response)
        if (response.status === 200) {
          this.tables = retour.data.sort((a, b) => a.poids - b.poids)
          console.log('tables =', this.tables)
        } else {
          this.tables = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    readNfc(identity, mode) {
      const uuid = uuidv4()
      this.nfc = {
        uuid,
        identity,
        read: true,
        mode
      }
    },
    restoreStatusNfc(status) {
      this.nfc = status
    },
    stopNfc() {
      this.nfc.identity = ''
      this.nfc.uuid = ''
      this.nfc.read = false
    }
  },
  persist: {
    enabled: true
  }
})