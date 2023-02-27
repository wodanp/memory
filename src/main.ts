import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from './router'
import Qui from '@qvant/qui-max';
import '@qvant/qui-max/styles';

import "./sass/style.sass";

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(router)
    .use(Qui)
    .mount("#app");
