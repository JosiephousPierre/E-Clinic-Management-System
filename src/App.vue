<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

const items = [
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    to: "/home",
  },
  {
    label: "Manage",
    icon: "pi pi-fw pi-user",
    to: "/manage",
  },
  {
    label: "Consult",
    icon: "pi pi-fw pi-list",
    to: "/consultation",
  },
  {
    label: "Records",
    icon: "pi pi-fw pi-id-card",
    to: "/records",
  },
  {
    label: "Medicine",
    icon: "pi pi-fw pi-heart-fill",
    to: "/medicine",
  },
  {
    label: "Consulted Medication",
    icon: "pi pi-fw pi-list",
    to: "/consulted_med",
  },
  {
    label: "Consulted Illness",
    icon: "pi pi-fw pi-list",
    to: "/consulted_illness",
  },
  {
    label: "Symptoms",
    icon: "pi pi-fw pi-list",
    to: "/symptoms",
  },
  {
    label: "Logout",
    icon: "pi pi-fw pi-sign-out",
    to: "/",
  },
];
</script>

<template>
  <div>
    <Menubar
      v-if="route.path !== '/'"
      :model="items"
      style="background-color: #ff6ec7; margin: 0"
    />
    <!-- Render router-view for other routes -->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
