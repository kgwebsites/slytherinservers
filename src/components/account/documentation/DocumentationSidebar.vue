<template>
    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <router-link :to="{ name: 'overview' }" class="nav-link" active-class="active">Overview</router-link>
            </li>
        </ul>
    </nav>
</template>