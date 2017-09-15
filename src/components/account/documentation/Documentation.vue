<template>
    <section id="documentation">
        <documentation-sidebar/>
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </section>
</template>
<script>
    import DocumentationSidebar from './DocumentationSidebar.vue';

    export default {
        components: {
            documentationSidebar: DocumentationSidebar
        }
    }
</script>