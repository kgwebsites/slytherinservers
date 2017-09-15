<template>
    <section id="settings-email-notifications">
        <div class="container-fluid">
            <div class="row">
                <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                    <h1>Email Notifications</h1>
                    <div class="card">
                        <div class="card-body">
                            <div class="row ml-0 mr-0">
                                <label for="notifications-status" class="col-md-4 pl-0 col-form-label form-text">
                                    <span v-if="notifications">
                                        Turn off email notifications
                                    </span>
                                    <span v-else>
                                        Turn on email notifications
                                    </span>
                                </label>
                                 <div class="col-md-8 pl-0">
                                    <!-- Rounded switch -->
                                    <label class="switch form-text m-0">
                                        <input type="checkbox" id="notifications-status" :checked="notifications" @change="changeNotification('status', $event)">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <transition name="fade" mode="out-in">
                                <div v-if="notifications" class="row ml-0 mr-0 pt-3 pb-3">
                                    <label for="notifications-email" class="col-md-4 pl-0 col-form-label form-text">Notifications sent to</label>
                                    <input type="email" id="notification-email" class="col-md-8 form-control" placeholder="bob@bobsburgers.com" :value="notificationEmail" @change="changeNotification('email', $event)">
                                </div>
                            </transition>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </section>
</template>
<script>
    import firebase from 'firebase';

    export default {
        data() {
            return {
                notifications: this.$store.state.settings.notifications,
                notificationEmail: this.$store.state.settings.notificationEmail,
            }
        },
        methods: {
            changeNotification: function(prop, event) {
                //Update data
                if (prop === 'status') {
                    this.notifications = !this.notifications;
                } else if (prop === 'email'){
                    this.notificationEmail = event.target.value;
                }

                const settings = {
                    notifications: this.notifications,
                    notificationEmail: this.notificationEmail
                }

                //Update database
                firebase.database().ref('accounts/' + this.$store.state.user.uid + '/settings').set(settings);

                //Update state
                this.$store.dispatch('updateSettings', settings);
            }
        }
    }
</script>