<template>
  <div :id="'categorie' + data.id" class="categories-item d-flex flex-column justify-content-center align-items-center overflow-hidden" @click="setArticleClassActive($event, 'article-class-active' + data.id)">
    <div class="categories-rep" :style="`background-color: ${data.couleur_backgr};`"></div>
    <i :class="`categories-icon fas ${data.icon}`"></i>
    <div class="w-100 d-flex flex-column justify-content-center align-items-center categories-nom"
         v-html="htmlStringName(data.name)"></div>
  </div>
</template>

<script setup>
import {useAppStore} from '@/store'

const {setArticleClassActive, getArticleClassActive} = useAppStore()
const props = defineProps({
  data: Object
})

function htmlStringName(nameRaw) {
  const name = nameRaw.replace('<', '').replace('>', '').split(' ')
  let html = ''
  for (const nameKey in name) {
    html += '<div>' + name[nameKey] + '</div>'
  }
  return html
}

</script>

<style scoped>
.categories-item {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  border: 1px solid #2d373f;
  color: #91979c;
}

.commande-class-active {
  color: white;
}

.categories-icon {
  font-size: 2.4rem;
}

.categories-rep {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  opacity: 0.5;
}
</style>