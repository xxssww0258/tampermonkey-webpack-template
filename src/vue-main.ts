import { App, createApp } from 'vue'
import MyApp from './components/App.vue'

const appEl = document.createElement('div')
appEl.id = 'app'
document.body.insertBefore(appEl, document.body.firstChild)
const app: App = createApp(MyApp)
app.mount(appEl)
