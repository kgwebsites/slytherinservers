import {store} from './store/store.js';

import AlbumHeader from './components/layouts/album/Header.vue';
import AccountHeader from './components/layouts/dashboard/Header.vue';
import Footer from './components/layouts/Footer.vue';

import Register from './components/Register.vue';
import Login from './components/Login.vue';

import Welcome from './components/Welcome.vue';
import Account from './components/account/Account.vue';

//Dashboard
import Dashboard from './components/account/dashboard/Dashboard.vue';
import ContactRequests from './components/account/dashboard/ContactRequests.vue';

//Settings
import Settings from './components/account/settings/Settings.vue';
import Profile from './components/account/settings/Profile.vue';
import EmailNotifications from './components/account/settings/EmailNotifications.vue';

//Documentation
import Documentation from './components/account/documentation/Documentation.vue';
import Overview from './components/account/documentation/Overview.vue';

export const routes = [
    {
        path: '', 
        name: 'welcome', 
        components: {
            default: Welcome,
            'template-header': AlbumHeader,
            'template-footer': Footer
        }
    },
    {
        path: '/register', 
        name: 'register', 
        components: {
            default: Register,
            'template-header': AlbumHeader,
            'template-footer': Footer
        }
    },
    {
        path: '/login', 
        name: 'login',  
        components: {
            default: Login,
            'template-header': AlbumHeader,
            'template-footer': Footer
        }
    },
    { 
        path: '/account', 
        name: 'account',
        redirect: { name: 'overview' },
        components: {
            default: Account,
            'template-header': AccountHeader
        },
        beforeEnter: (to, from, next) => {
            if (store && store.state.user != "") {
                next();
            }
            else {
                next('login');
            }
        },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                redirect: { name: 'contact-requests'},
                components: {
                    default: Dashboard
                },
                children: [
                    {
                        path: 'contact-requests',
                        name: 'contact-requests',
                        component: ContactRequests
                    }
                ]
            },
            {
                path: 'settings',
                name: 'settings',
                redirect: { name: 'profile' },
                components: {
                    default: Settings
                },
                children: [
                    {
                        path: 'profile',
                        name: 'profile',
                        component: Profile
                    },
                    {
                        path: 'email-notifications',
                        name: 'email-notifications',
                        component: EmailNotifications
                    }
                ]
            },
            {
                path: 'documentation',
                name: 'documentation',
                redirect: { name: 'overview' },
                components: {
                    default: Documentation
                },
                children: [
                    {
                        path: 'overview',
                        name: 'overview',
                        component: Overview
                    }
                ]
            }
        ]
    },
];