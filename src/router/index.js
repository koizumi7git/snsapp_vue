import { createRouter, createWebHistory, } from 'vue-router'
import Main from '../views/Main.vue'
import LoginRegister from '../views/LoginRegister.vue'
import firebase from 'firebase'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path:'/LoginSignup',
    name: 'LoginSignup',
    component: LoginRegister,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.path == "/LoginSignup") {
    next();
    console.log('１個目')
  } else {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next();
        console.log('２個目')
      } else {
        next({ path: "/LoginSignup" });
        console.log('３個目')
      }
    });
  }
});

export default router
