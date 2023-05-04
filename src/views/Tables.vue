<template>
  Tables
  <pre>
  {{ tables }}
    </pre>
</template>


<script setup>
import {storeToRefs} from "pinia"
import {useAppStore} from '@/store'

const store = useAppStore()
// rendre réactif les propriétées d'un store

const {tables} = storeToRefs(store)

// définir les actions d'un store
const {loadTables} = useAppStore()

loadTables()
</script>

<style>
</style>
