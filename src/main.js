import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAl5YWKCNs0DSrIjCcmuVqP7M9bGeZRBW4",
    authDomain: "sns-app-a0580.firebaseapp.com",
    databaseURL: "https://sns-app-a0580-default-rtdb.firebaseio.com",
    projectId: "sns-app-a0580",
    storageBucket: "sns-app-a0580.appspot.com",
    messagingSenderId: "437594984772",
    appId: "1:437594984772:web:e751d15e1819b1c0110711",
    measurementId: "G-LHTZGYR3EQ"
    };

firebase.initializeApp(firebaseConfig);


createApp(App).use(store).use(router).mount('#app')
