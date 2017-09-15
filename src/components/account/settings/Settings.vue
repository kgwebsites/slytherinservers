<template>
    <section id="settings">
        <settings-sidebar/>
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </section>
</template>
<script>
    import SettingsSidebar from './SettingsSidebar.vue';

    export default {
        components: {
            settingsSidebar: SettingsSidebar
        }
    }

</script>