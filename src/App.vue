<template>
    <div id="app-app">
        <router-view name="template-header"></router-view>

            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        
        <router-view name="template-footer"></router-view>
    </div>
</template>
<style>
.fade-enter{
    opacity: 0;
}
.fade-enter-active{
    transition: opacity .5s ease-in-out;
}
.fade-leave-active{
    opacity: 0;
    transition: opacity .5s ease-in-out;
}

html, body, #app-app, .jumbotron {
    height: 100%;
}
</style>