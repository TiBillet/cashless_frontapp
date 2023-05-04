<template>
  <Loading v-if="loading"/>
  <Navbar/>
  <div id="alert-place" v-if="alertData.length > 0">
    <Alert v-for="(item, index) in alertData" :key="index" :uuid="item.uuid" :type="item.type" :title="item.title"
           :message="item.message"/>
  </div>

  <router-view></router-view>
</template>


<script setup>
import { ref } from 'vue'
import Alert from '@/components/Alert.vue'
import Loading from '@/components/Loading.vue'
import Navbar from '@/components/Navbar.vue'
import { v4 as uuidv4 } from 'uuid'

// machine
// import { ref } from 'vue'
import { interpret , State } from 'xstate'
import { cashlessMachine } from '@/machine'

let loading = ref(false)
let alertData = ref([])

const machine = interpret(cashlessMachine)
const persistState = JSON.parse(localStorage.getItem('cashlessState'))
State.context = persistState

let currentState = ref(machine.initialState)
let currentContext = ref(machine.context)

machine.onTransition((state) => {
  // Update the current state component data property with the next state
  currentState.value = state.value
  // Update the context component data property with the updated context
  currentContext.value = state.context
  // localStorage.setItem('cashlessState', JSON.stringify(state.context))
  console.log('currentState =', currentState.value)
  console.log('currentContext =', currentContext.value)
})

machine.start()

// event
machine.send('LOGIN')




document.body.addEventListener('loading', (data) => {
  console.log('loading =', data.detail)
  loading.value = data.detail.value
})

document.body.addEventListener('hideMessage', (data) => {
  const infos = data.detail
  alertData.value = alertData.value.filter(alt => alt.uuid !== infos.uuid)
})

document.body.addEventListener('showMessage', (data) => {
  const infos = data.detail
  const uuid = uuidv4()
  const autoRemove = infos.autoRemove ?? true

  console.log('showMessage infos =', infos)
  // create new message
  alertData.value.push({
    uuid,
    title: infos.title,
    type: infos.type,
    message: infos.message
  })
  // remove message after 6 s
  console.log('autoRemove =', autoRemove)
  if (autoRemove === true) {
    setTimeout(() => {
      alertData.value = alertData.value.filter(alt => alt.uuid !== uuid)
    }, 6000)
  }
})

function addAlert () {
  alertData.value.push({
    uuid: uuidv4(),
    title: 'teste titre',
    type: 'alert-success',
    message: 'Un exemple de message'
  })
}
</script>

<style>
#alert-place {
  z-index: 99;
  position: absolute;
  left: 0;
  top: 60px;
}
</style>
