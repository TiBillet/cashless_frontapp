<template>
    <div>Attente</div>
    <div>lecture carte</div>
    <div v-if="store.getInfosNfc.identity === 'cm'">Carte maîtresse</div>
</template>

<script setup>
import {useAppStore} from '@/store'

const store = useAppStore()
</script>

<style scoped>

</style>