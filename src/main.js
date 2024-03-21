import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Dropdown, Ripple, initTWE } from "tw-elements";
initTWE({Dropdown, Ripple})

createApp(App).mount('#app')
