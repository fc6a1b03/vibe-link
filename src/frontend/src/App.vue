<template>
  <div id="app">
    <nav style="margin-bottom: 1rem;">
      <router-link style="font-weight: bold; color: #34495e;" to="/">Home</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';

const route = useRoute();
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>