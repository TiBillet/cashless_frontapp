import {io} from "socket.io-client"
import {useAppStore} from '@/store'

// NFCLO = serveur websocket(socket.io)/nfc local (Front+serveur nfc sur même machine), par défaut
// NFCMC = cordova, lecteur interne mobile
// NFCEM = émulation d'un lecteur nfc

export class Nfc {
  constructor() {
    this.modeNfc = import.meta.env.VITE_MODE_NFC
    this.port = import.meta.env.VITE_NFC_PORT_SERVER
    this.TOKEN = import.meta.env.VITE_TOKEN
    this.SOCKET = null
    this.ip = import.meta.env.VITE_IP_LOCAL
    this.callback = null
    this.intervalIDVerifApiCordova = null
    if (this.modeNfc === 'NFCLO') {
      // initialise la connexion
      this.SOCKET = io(`http://${this.ip}:${this.port}`, {query: {token: this.TOKEN}})

      // initialise la réception d'un tagId, méssage = 'envoieTagId'
      this.SOCKET.on('envoieTagId', (retour) => {
        // console.log('retour serveur nfc : ', retour)
        this.verificationTagId(retour.tagId, retour.uuidConnexion)
      })

      // initialise la getion des erreurs socket.io
      this.SOCKET.on('connect_error', (error) => {
        // TODO: émettre un log
        console.error('Socket.io : ', error)
      })

      // cordova
      if (this.modeNfc === 'NFCMC') {
        this.intervalIDVerifApiCordova = setInterval(() => {
          this.initCordovaNfc()
        }, 500)
      }

      // TODO: émulation modeNfc = NFCEM
    }
  }

  initCordovaNfc() {
    try {
      nfc.addTagDiscoveredListener(
        (nfcEvent) => {
          let tag = nfcEvent.tag
          // sys.log('tagId = ' + nfc.bytesToHexString(tag.id))
          if (this.etatLecteurNfc.cordovaLecture === true) {
            this.verificationTagId(nfc.bytesToHexString(tag.id), this.etatLecteurNfc.uuidConnexion)
          }
        },
        function () {
          console.log("Lecture tag id: OK!")
        },
        function () {
          console.log("Lecture tag id:  Erreur!")
        })
      clearInterval(this.intervalIDVerifApiCordova)
    } catch (e) {
      console.log(' -> nfc indéfini, réessayer !')
    }
  }

  verificationTagId(tagId, uuidConnexion) {
    let msgErreurs = 0, data

    // mettre tagId en majuscule
    if (tagId !== null) {
      tagId = tagId.toUpperCase()

      // vérifier taille tagId
      let tailleTagId = tagId.length
      if (tailleTagId < 8 || tailleTagId > 8) {
        msgErreurs++
        // TODO: émettre un log
        console.log('Erreur, taille tagId = ' + tailleTagId + ' !!')
      }

      // vérifier uuidConnexion
      const store = useAppStore()
      const uuidConnexionStore = store.getInfosNfc.uuid
      if (uuidConnexion !== uuidConnexionStore) {
        msgErreurs++
        // TODO: émettre un log
        console.log('Erreur uuidConnexion différent !!')
      }

      // fixe le tagId à 'erreur'
      if (msgErreurs !== 0) {
        tagId = 'erreur'
      }

      // lance la fonction de callback
      this.callback(tagId)
      store.stopNfc()


    }
  }

  lireTagId(identity, callback) {
    // console.log('-> lire tagid !')
    this.callback = callback
    const store = useAppStore()
    store.readNfc(identity, this.modeNfc)
    const uuidConnexion = store.getInfosNfc.uuid
    // console.log('uuidConnexion =', uuidConnexion)

    // tagId pour "un serveur nfc + front" en local (socket.io)
    if (this.modeNfc === "NFCLO") {
      this.SOCKET.emit('demandeTagId', {uuidConnexion})
      // TODO: émettre un log
      // console.log('Front - SOCKET.emit : demandeTagId .')
    }
  }

  annuleLireTagId() {
    const store = useAppStore()
    const uuidConnexion = store.getInfosNfc.uuid

    // tagId pour "un serveur nfc + front" en local
    if (this.modeNfc === "NFCLO") {
      // console.log('-> émettre: "AnnuleDemandeTagId"')
      this.SOCKET.emit('AnnuleDemandeTagId', {uuidConnexion})
    }

    store.stopNfc()
  }
}

// Etendre la class rfid afin d'émuler la lecture d'une carte
export class emuleNfc extends Nfc {
    constructor(length) {
      super(length, length)
      this.name = 'simuNfc'
      this.SOCKET.close()
    }

    emulerLecture(valeur) {
      const store = useAppStore()
      // emule la lecture d'un tagId
      const uuidConnexion = store.getInfosNfc.uuid
      this.verificationTagId(valeur, uuidConnexion)
    }
  }

