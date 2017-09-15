<template>
    <section id="dashboard">
        <dashboard-sidebar/>
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </section>
</template>
<script>
    import DashboardSidebar from './DashboardSidebar.vue';

    export default {
        components: {
            dashboardSidebar: DashboardSidebar
        }
    }
</script>