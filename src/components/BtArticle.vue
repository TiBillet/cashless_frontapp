<template>
  <div
      v-if="articleClassActive === 'article-class-activetous' || articleClassActive === 'article-class-active' + data.categorie.id"
      class="article-conteneur" :style="articleConteneurStyle">
    <div v-if="data.url_image !== null"
         class="article-image d-flex justify-content-center align-items-center overflow-hidden">
      <img :src="data.url_image" class="" loading="lazy">
    </div>
    <div class="article-nom" :style="articleNomStyle">{{ data.name }}</div>
    <div class="article-pdp d-flex flex-row justify-content-start" :style="`color: ${couleurTexte};`">
      <div class="article-icon" :style="articleIconStyle">
        <i :class="`fas ${data.categorie.icon}`"></i>
      </div>
      <div class="article-icon d-flex flex-row justify-content-start">
        {{ data.prix }} €
      </div>
      <div class="article-nombre d-flex flex-row">
        <span :id="'rep-nb-article' + data.id" class="badge">0</span>
      </div>
    </div>
    <div :id="'article-rideau' + data.id" class="article-rideau"></div>
  </div>
</template>

<script setup>
import {useAppStore} from '@/store'
import {storeToRefs} from "pinia"

const store = useAppStore()
// rendre réactif les propriétées d'un store
const {articleClassActive} = storeToRefs(store)

const props = defineProps({
  data: Object,
  width: String,
  height: String
})


// couleur de fond de l'article
// par défaut
let couleurFond = '#189ac8'
// affiche ou pas le fond
if (props.data.categorie !== null && props.data.categorie.couleur_backgr !== null) {
  couleurFond = props.data.categorie.couleur_backgr
}

// couleur du texte par défaut
let couleurTexte = props.data.categorie.couleur_texte
// couleur du texte de l'article prioritaire pour mieux resortir sur l'image
if (props.data.couleur_texte !== null) {
  couleurTexte = props.data.couleur_texte
}
if (couleurTexte === undefined || couleurTexte === null) {
  couleurTexte = '#FFFFFF';
}

const articleConteneurStyle = {
  width: props.width,
  height: props.height,
  backgroundColor: couleurFond,
  margin: '3px'
}

const articleNomStyle = {
  color: couleurTexte,
  textShadow: `2px 2px 3px ${colorLuminance(couleurFond, -0.5)};`
}

const articleIconStyle = {
  flexBasis: '25%',
  color: couleurTexte,
  fontStyle: 'normal'
}

/**
 * Obtenir une couleur plus claire ou plus sombre
 *@param {string} hex = couleur en hexadécimal
 *@param {float} lum = positif => claire, négatif => sombre
 *@return {string} rgb = coluleur format rgb
 * by Craig Buckler
 */
function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }
  return rgb;
}
</script>

<style scoped>
.article-conteneur {
  position: relative;
  font-family: 'Source Sans', sans-serif;
  box-sizing: border-box;
  border-radius: 15px;
}

.article-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.7;
}

.article-nom {
  position: absolute;
  left: 8px;
  top: 6px;
  font-weight: bold;
  max-height: 60px;
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 1rem;
  overflow: hidden;
}

.article-pdp {
  position: absolute;
  left: 8px;
  bottom: 8px;
  font-weight: bold;
  font-size: 20px;
}

.article-nombre {
  flex-basis: 25%;
}

.article-rideau {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #2a2828;
  opacity: 0.5;
  cursor: default;
  display: none;
}
</style>