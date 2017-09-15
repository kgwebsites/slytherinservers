<template>
    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <router-link :to="{ name: 'profile' }" class="nav-link" active-class="active">Profile</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'email-notifications' }" class="nav-link" active-class="active">Email Notifications</router-link>
            </li>
        </ul>
    </nav>
</template>