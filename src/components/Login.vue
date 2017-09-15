<template>
    <form class="form-signin">
        <div class="form-group">
            <h2 class="form-signin-heading">Login</h2>
        </div>
        <div class="form-group">
            <label for="inputEmail" class="sr-only">Email address</label>
            <input type="email"
                    id="inputEmail" 
                    class="form-control" 
                    placeholder="Email address" 
                    v-model="account.email"
                    required autofocus>
        </div>
        <div class="form-group">
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" 
                    id="inputPassword" 
                    class="form-control" 
                    placeholder="Password" 
                    v-model="account.password"
                    required>
        </div>
        <button type="button"
                class="btn btn-lg btn-primary btn-block" 
                @click="login">Login
        </button>
        <button type="button"
                class="btn btn-lg btn-dark btn-block" 
                @click="authenticate('github')">
            <i title="Github" alt="Github" class="devicon-github-plain"></i> Login with Github
        </button>
        <router-link class="btn btn-text text-center btn-block" :to="{name: 'register'}">Register an Account</router-link>
    </form>
</template>
<script>
    import store from '../store/store.js'
    import firebase from 'firebase';

    export default {
        data() {
            return {
                account: {
                    email: '',
                    password: ''
                }
            }
        },
        computed: {
            isAuthenticated: function () {
                return this.$store.getters.isAuthenticated()
            }
        },
        methods: {
            login() {
                const self = this;
                
                firebase.auth().signInWithEmailAndPassword(self.account.email, self.account.password).then(response => {
                    //User logged in successful.
                    const user = response;

                    //Update store with user
                    self.$store.dispatch('updateUser', user).then(response => {

                        //Update store with settings
                        let userSettings = firebase.database().ref('accounts/' + user.uid + '/settings');
                        userSettings.once('value').then(settings => {
                            self.$store.dispatch('updateSettings', settings.val());
                        });

                        //Update store with requests
                        self.$http.post('account/requests', self.$store.state.user).then(response => {
                            if (response.data.status == 200) {
                                let requests = '';
                                if (response.data.requests != null) {
                                    let requests = response.data.requests;
                                }
                                let requestsArray = Object.values(requests);
                                let desc = requestsArray.slice(0);
                                desc.sort(function (a, b) {
                                    return a.timestamp - b.timestamp;
                                });
                                self.$store.dispatch('updateRequests', desc).then(response => {
                                    self.$router.push('account');
                                }, error => {
                                    alert(response.data.error[0].msg);
                                });
                            } else {
                                alert(response.data.error[0].msg);
                            }
                        }, error => {
                            alert('Failed to connect to server. Please try a different internet connection.');
                        });
                    });
                }).catch(function (error) {
                    console.log(error);
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert('Error Code: ' + error.code + ' - ' + error.msg);
                });
            },
            authenticate(social) {
                    if (social == 'github') {
                        var provider = new firebase.auth.GithubAuthProvider();
                    }
                    const self = this;
                    firebase.auth().signInWithPopup(provider).then(function (response) {
                        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                        let token = response.credential.accessToken;
                        let userSettings = firebase.database().ref('accounts/' + response.user.uid + '/settings');

                        //Update store with user account
                        self.$store.dispatch('updateUser', response.user);

                        //If no settings in account, set default settings
                        userSettings.once('value').then(settings => {
                            if (settings.val() == null) {
                                userSettings.set({
                                    notifications: true,
                                    notificationEmail: response.user.email
                                }).catch(error => {
                                    alert('Error Code: ' + error.code + ' - ' + error.msg);
                                });
                            }
                        });
                        //Get Requests
                        self.$http.post('account/requests', self.$store.state.user).then(response => {
                            if (response.data.status == 200) {
                                let requests = response.data.requests;

                                if (requests) {
                                    let requestsArray = Object.values(requests);
                                    let desc = requestsArray.slice(0);

                                    desc.sort(function (a, b) {
                                        return a.timestamp - b.timestamp;
                                    });

                                    //Update store requests
                                    self.$store.dispatch('updateRequests', desc);
                                }

                                //Go to account page
                                self.$router.push('account');
                            } else {
                                alert(response.data.error[0].msg);
                            }
                        }, error => {
                            alert('Failed to connect to server. Please try a different internet connection.');
                        });
                    }).catch(function (error) {
                        alert(error);
                    });
                }
        }
    }
</script>
<style>
    .form-signin {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }
</style>