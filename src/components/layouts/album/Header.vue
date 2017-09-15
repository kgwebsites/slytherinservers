<template>
    <section id="layout-album-header">
        <transition name="slide" mode="out-in">
            <div class="bg-dark" id="navbarHeader" v-if="navActive == true">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-4 py-4">
                            <h4 class="text-white">Account</h4>
                            <ul v-if="!$store.state.user" class="list-unstyled">
                                <li><a href="#" @click="go('login', $event)" class="text-white">Login</a></li>
                                <li><a href="#" @click="go('register', $event)" class="text-white">Register</a></li>
                            </ul>
                            <ul v-else class="list-unstyled">
                                <li><a href="#" @click="go('account', $event)" class="text-white">Dashboard</a></li>
                                <li><a href="#" @click="logout" class="text-white">Logout</a></li>
                            </ul>
                        </div>
                        <div class="col-sm-4 py-4 text-center">
                            <h4 class="text-white">Developers</h4>
                            <ul class="list-unstyled">
                                <li><a href="#" class="text-white">Documentation</a></li>
                                <li><a href="#" class="text-white">Github Repo</a></li>
                                <li><a href="#" class="text-white">Demo</a></li>
                            </ul>
                        </div>
                        <div class="col-sm-4 py-4 text-right">
                            <h4 class="text-white">Contact</h4>
                            <ul class="list-unstyled">
                                <li><a href="https://github.com/kgwebsites" class="text-white">Github</a></li>
                                <li><a href="#" class="text-white">Form</a></li>
                                <li><a href="#" class="text-white">Email</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="navbar navbar-dark bg-dark">
            <div class="container d-flex justify-content-between">
                <router-link to="/" class="navbar-brand">Contact Form API</router-link>
                <button class="navbar-toggler" @click="navActive = !navActive ? 1 : 0">
                <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                navActive: 0 
            }
        },
        methods: {
            go(route, event){
                event.preventDefault();
                this.navActive = 0;
                this.$router.push({ name: route });
            },
            logout() {
                this.$store.dispatch('logout');
            }
        }
    }
</script>
<style>
.slide-enter {
    position: relative;
    margin-top: -168px;
}

.slide-enter-active {
    transition: all ease-in-out .5s;
}

.slide-leave-active {
    transition: all .5s;
    position: relative;
    margin-top: -168px;
}
</style>