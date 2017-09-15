<template>
    <section id="layout-dashboard-header">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <router-link class="navbar-brand" to="account">Account</router-link>
            <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                    <router-link tag="li" class="nav-item" active-class="active" :to="{ name: 'dashboard' }">
                        <a class="nav-link">Dashboard</a>
                    </router-link>
                    <router-link tag="li" class="nav-item" active-class="active" :to="{ name: 'settings' }">
                        <a class="nav-link" href="#">Settings</a>
                    </router-link>
                    <router-link tag="li" class="nav-item" active-class="active" :to="{ name: 'documentation' }">
                        <a class="nav-link" href="#">Documentation</a>
                    </router-link>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="logout">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    </section>
</template>
<script>
    export default {
        methods: {
            logout() {
                this.$store.dispatch('logout');
                this.$router.go('/login');
            }
        }
    }
</script>
<style scoped>
    .table-striped th {
        border-top: 0;
    }
    .nav-item a {
        font-weight: 100;
    }
</style>
<style>
    /*
    * Base structure
    */

    /* Move down content because we have a fixed navbar that is 3.5rem tall */
    body {
    padding-top: 3.5rem;
    }

    /*
    * Typography
    */

    h1 {
    margin-bottom: 20px;
    padding-bottom: 9px;
    border-bottom: 1px solid #eee;
    }

    /*
    * Sidebar
    */

    .sidebar {
    position: fixed;
    top: 36px;
    bottom: 0;
    left: 0;
    z-index: 1000;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    border-right: 1px solid #eee;
    }

    /* Sidebar navigation */
    .sidebar {
    padding-left: 0;
    padding-right: 0;
    }

    .sidebar .nav {
    margin-bottom: 20px;
    }

    .sidebar .nav-item {
    width: 100%;
    }

    .sidebar .nav-item + .nav-item {
    margin-left: 0;
    }

    .sidebar .nav-link {
    border-radius: 0;
    }

    /*
    * Dashboard
    */

    /* Placeholders */
    .placeholders {
    padding-bottom: 3rem;
    }

    .placeholder img {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    }
</style>