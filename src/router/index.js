import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Consultation from "../components/Consultation/Consultation.vue";
import Records from "../components/Records/Records.vue";
import Login from "../components/Login.vue";
import Manage from "../components/Manage/Manage.vue";
import Medicine from "../components/Medicine/Medicine.vue";
import Symptoms from "../components/Symptoms/Symptoms.vue";
import Consulted_med from "../components/Consulted_med/Consulted_med.vue";
import Consulted_illness from "../components/Consulted_illness/Consulted_illness.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/manage",
    name: "Manage",
    component: Manage,
  },
  {
    path: "/consultation",
    name: "Consultation",
    component: Consultation,
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/medicine",
    name: "Medicine",
    component: Medicine,
  },
  {
    path: "/symptoms",
    name: "Symptoms",
    component: Symptoms,
  },
  {
    path: "/consulted_med",
    name: "Consulted Medication",
    component: Consulted_med,
  },
  {
    path: "/consulted_illness",
    name: "Consulted Illness",
    component: Consulted_illness,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
