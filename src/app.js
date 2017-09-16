//Bootstrap Sass
require('../node_modules/bootstrap/scss/bootstrap.scss');
//Bootstrap Album Theme
require('./assets/theme.css');
//Pretty Text
require('./assets/prettytext.js');

import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import { store } from './store/store';
import firebase from 'firebase';

const firebaseDBUrl = 'https://slytherin-servers.firebaseio.com/';
const firebaseAuthDomain = 'slytherin-servers.firebaseapp.com';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBoZTHS7flw3FeqAwlP-wUr7hORUVeh5IM",
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDBUrl,
    projectId: "slytherin-servers",
    storageBucket: "slytherin-servers.appspot.com",
    messagingSenderId: "737726446033"
};
firebase.initializeApp(config);

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.http.options.root = 'http://localhost:3000/';

const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});