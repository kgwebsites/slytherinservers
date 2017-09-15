<template>
    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <router-link :to="{ name: 'contact-requests' }" class="nav-link" active-class="active">Contact Requests</router-link>
            </li>
        </ul>
    </nav>
</template>