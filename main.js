import { effect , reactive } from './core/index.js'
import { createApp } from './index.js'
import App from './App.js'

createApp(App).mount(document.querySelector('#App'))