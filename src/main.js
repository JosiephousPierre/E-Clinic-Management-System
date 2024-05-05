import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import Menubar from "primevue/menubar";
import router from "./router";
import { users, records, categories, manage } from "./db/dummy_data.js";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

localStorage.setItem("user", JSON.stringify(users));
localStorage.setItem("records", JSON.stringify(records));
localStorage.setItem("categories", JSON.stringify(categories));
localStorage.setItem("manage", JSON.stringify(manage));

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
createApp(App)
  .use(pinia)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .component("Menubar", Menubar)
  .mount("#app");
