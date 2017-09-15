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

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBbWxwjQ_2nXgzZXTUfUjeCST_aLvoYtnw",
    authDomain: "serverless-io.firebaseapp.com",
    databaseURL: "https://serverless-io.firebaseio.com/",
    projectId: "serverless-io",
    storageBucket: "serverless-io.appspot.com",
    messagingSenderId: "23294201740"
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