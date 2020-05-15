import Vue from "vue";
import VueRouter from "vue-router";
import PageHome from "../views/Home";
import PageItems from "../views/Items";
import PageGroups from "../views/Groups";
import PageGroup from "../views/Group";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: PageHome,
    meta: {
      auth: false
    }
  },
  {
    name: "items",
    path: "/item/:itemID?",
    component: PageItems,
    meta: {
      auth: false
    }
  },
  {
    name: "groups",
    path: "/group",
    component: PageGroups,
    meta: {
      auth: false
    },
    children: [
      {
        name: "group",
        path: ":id/:itemID?",
        component: PageGroup
      }
    ]
  },
  {
    name: "adminHome",
    path: "/admin",
    component: PageHome,
    meta: {
      auth: true
    }
  },
  {
    name: "adminItems",
    path: "/admin/item",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/AdminItems"),
    meta: {
      auth: true
    }
  },
  {
    name: "adminBoards",
    path: "/admin/group",
    component: PageGroups,
    meta: {
      auth: true
    }
  },
  {
    name: "adminImport",
    path: "/admin/import",
    component: () =>
      import(/* webpackChunkName: "import" */ "@/views/AdminImport"),
    meta: {
      auth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
