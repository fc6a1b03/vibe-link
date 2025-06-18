import App from './App.vue'
import router from './router.ts'
import {createApp} from 'vue'

createApp(App).use(router).mount('#app')