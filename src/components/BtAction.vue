<template>
  <div class="d-flex justify-content-center align-items-center overflow-hidden" :style="btConteneurStyle">
    <div class="d-flex flex-row text-white mb-3">
      <i :class="`fas ${icon}`" :style="iconStyle"></i>
      <div>{{ name }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  color: String,
  icon: String
})

const btConteneurStyle = {
  width: '33.33%',
  height: '100%',
  fontSize: '1rem',
  fontWeight: 'bold',
  backgroundColor: props.color,
  textAlign: 'center'
}

const iconStyle = {
  marginRight: '4px',
  fontSize: '1.5rem'
}
</script>

<style>
</style>