<script setup>
var language = "";

import HelloWorld from './components/HelloWorld.vue'
import Introduction from './components/Introduction.vue'
</script>

<template>
    <p>Choose your language:</p>

    <form>
        <input type="radio" id="en" name="language" value="en" v-model="language">
        <label for="en">English</label><br>
        <input type="radio" id="es" name="language" value="es" v-model="language">
        <label for="es">Spanish</label><br>
    </form>

    <p>{{ language }}</p>

  <Introduction />
  <Introduction />
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
