import {createApp} from 'vue'
import router from './router'
// bootstrap
import '@/assets/css/bootstrap-5.0.2/bootstrap.min.css'
import '@/assets/js/bootstrap-5.0.2/bootstrap.bundle.min.js'
// fontawesome
import '@/assets/css/fontawesome-free/css/all.min.css'

import App from './App.vue'

// reset app state
import { resetStateMachine } from '@/machine'
resetStateMachine()

const app = createApp(App)
app.use(router).mount('#app')

