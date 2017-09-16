<template>
    <form class="form-signin text-left">
        <h2 class="form-signin-heading">Register</h2>
        <div class="form-group">
            <label for="inputEmail" class="sr-only" >Email address *</label>
            <input v-model="account.email" type="email" id="inputEmail" placeholder="Email Address" class="form-control" required autofocus>
        </div>
        <div class="form-group">
            <label for="firstName" class="sr-only">First Name *</label>
            <input v-model="account.first_name" type="text" id="firstName" placeholder="First Name" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="lastName" class="sr-only">Last Name *</label>
            <input v-model="account.last_name" type="text" id="lastName" placeholder="Last Name" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="inputPassword" class="sr-only">Password *</label>
            <p>
                <vue-password v-model="account.password" classes="input form-control" placeholder="Password">
                </vue-password>
            </p>
            <small>Password must be at least 8 digits and medium strength</small>
        </div>
        <div class="form-group">
            <button :disabled="!prevalidate" @click="register" class="btn btn-lg btn-primary btn-block" type="button">Register</button>
        </div>
        <button type="button" class="btn btn-lg btn-dark btn-block" @click="authenticate('github')">
            <i title="Github" alt="Github" class="devicon-github-plain"></i> Login with Github
        </button>
        <router-link class="btn btn-text text-center btn-block" :to="{name: 'login'}">Login</router-link>
        <div v-if="displayErrors" class="form-group">
            <p class="text-danger" v-for="error in errors"><small>{{ error }}</small></p>
        </div>
    </form>
</template>
<script>
    import VuePassword from 'vue-password'
    import firebase from 'firebase';

    export default {
        data(){
            return {
                account: {
                    email: '',
                    first_name: '',
                    last_name: '',
                    password: ''
                },
                errors: {
                    email: '',
                    name: '',
                    passwordLength: '',
                    passwordStrength: ''
                },
                displayErrors: false
            }
        },
        methods: {
            validate(){
                this.displayErrors = false;
                if (this.validateEmail() && this.validateName() && this.validatePasswordLength() && this.validatePasswordStrength()) {
                    return true;
                } else {
                    this.displayErrors = true;
                }
            },
            validateEmail(){
                this.errors.email = '';
                if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.account.email)){
                    return true;
                } else {
                    this.errors.email = 'Valid email required';
                }
            },
            validateName(){
                this.errors.name = '';
                if(this.account.first_name.length > 0 && this.account.last_name.length > 0){
                    return true;
                } else {
                    this.errors.name = 'First and last name are required';
                }
            },
            validatePasswordLength(){
                this.errors.passwordLength = '';
                if(this.account.password.length > 7){
                    return true;
                } else {
                    this.errors.passwordLength = 'Password must be at least 8 characters';
                }
            },
            validatePasswordStrength(){
                this.errors.passwordStrength = '';
                var strength = document.getElementsByClassName('VuePassword__Message')[0].innerText;
                if (strength != 'VERY WEAK' && strength != 'WEAK'){
                    return true;
                } else {
                    this.errors.passwordStrength = 'Password strength must be at least medium strength';
                }
            },
            register() {
                if(this.validate()){
                    let account = {
                        name: {
                            first: this.account.first_name.charAt(0).toUpperCase() + this.account.first_name.slice(1),
                            last: this.account.last_name.charAt(0).toUpperCase() + this.account.last_name.slice(1)
                        },
                        email: this.account.email,
                        password: this.account.password
                    }

                    //Create Firebase Account
                    const self = this;
                    firebase.auth().createUserWithEmailAndPassword(account.email, account.password).then(response => {
                        //User created successful
                        
                        //Update account with name
                        firebase.auth().currentUser.updateProfile({
                            displayName: account.name.first + ' ' + account.name.last,
                        }).then(() => {
                            //Set default settings
                            const newSettings = {
                                notifications: true,
                                notificationEmail: account.email
                            }
                            //Update DB with default settings
                            firebase.database().ref('accounts/' + response.uid + '/settings').set(newSettings)
                            .then(() => {
                                // Set store user
                                self.$store.dispatch('updateUser', response);
                                //Update store with settings
                                self.$store.dispatch('updateSettings', newSettings);
                                // Go to account page
                                self.$router.push('account');
                            }).catch(error => {
                                alert('Error Code: ' + error.code + ' - ' + error.msg);
                            });
                        });
                    }).catch(error => {
                        alert('Error Code: ' + error.code + ' - ' + error.msg);
                    });
                }
            },
            authenticate(social) {
                if(social == 'github'){
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
                        if(settings.val() == null){
                            const newSettings = {
                                notifications: true,
                                notificationEmail: response.user.email
                            }
                            userSettings.set(newSettings).catch(error => {
                                alert('Error Code: ' + error.code + ' - ' + error.msg);
                            });
                            //Update store with settings
                            self.$store.dispatch('updateSettings', newSettings);
                            //If there are settings, update the store with them
                        } else {
                            self.$store.dispatch('updateSettings', settings.val())
                        }
                    });
                    //Get Requests
                    self.$http.post('account/requests', self.$store.state.user).then(response => {
                        if (response.data.status == 200) {
                            let requests = response.data.requests;
                            
                            if(requests){
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
        },
        computed: {
            prevalidate: function() {
                if (this.validateEmail() && this.validateName() && this.validatePasswordLength()) {
                    return true;
                }
            }
        },
        components: {
            VuePassword
        }
    }
</script>
<style scoped>
.form-signin {
  max-width: 375px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>