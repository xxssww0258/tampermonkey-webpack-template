import { App, createApp } from 'vue'
import MyApp from './components/App.vue'
const app: App = createApp(MyApp)
const div = document.createElement('div')
div.id = 'app'
document.body.insertBefore(div, document.body.firstChild)
app.mount('#app')
