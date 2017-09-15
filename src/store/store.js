import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: {},
        settings: {},
        requests: []
    },
    getters: {
        user: state => {
            return state.user;
        },
        requests: state => {
            return state.requests;
        }
    },
    mutations: {
        updateUser: (state, payload) => {
            state.user = payload;
        },
        updateSettings: (state, payload) => {
            state.settings = payload;
        },
        updateRequests: (state, payload) => {
            state.requests = payload
        },
        logout: (state) => {
            state.user = '';
            state.requests = [];
        }
    },
    actions: {
        updateUser: ({ commit }, payload) => {
            commit('updateUser', payload);
        },
        updateSettings: ({ commit }, payload) => {
            commit('updateSettings', payload);
        },
        updateRequests: ({ commit }, payload) => {
            commit('updateRequests', payload);
        },
        logout: ({ commit }) => {
            commit('logout');
        }
    },
    plugins: [
        createPersistedState()
    ]
});