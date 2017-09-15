<template>
    <section id="settings-profile">
        <div class="container-fluid">
            <div class="row">
                <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                    <h1>Profile</h1>
                    <div class="card">
                        <div v-if="!accountPassword">
                            <div class="card-header col-12">
                                <h4 class="card-title m-0">Logged in with {{ $store.state.user.providerData[0].providerId }}</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4" v-if="!accountPassword">
                                <div class="card-body row">
                                    <div class="col-12" v-if="user.providerData[0].photoURL">
                                        <img :src="user.providerData[0].photoURL" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="card-body" :class="accountPic">
                                <div class="form-group row ml-0 mr-0">
                                    <label for="name" class="col-md-2 col-form-label">Name</label>
                                    <div class="col-md-10">
                                        <input :disabled="!accountPassword" type="text" class="form-control col-12" id="name" v-model="user.displayName">
                                    </div>
                                </div>
                                <div class="form-group row ml-0 mr-0">
                                    <label for="email" class="col-md-2 col-form-label">Email</label>
                                    <div class="col-md-10">
                                        <input :disabled="!accountPassword" type="text" class="form-control col-12" id="email" v-model="user.email">
                                    </div>
                                </div>   
                                <div v-if="accountPassword" class="form-group row ml-0 mr-0">
                                    <label for="password" class="col-md-2 col-form-label">Password</label>
                                    <div class="col-md-10">
                                        <button v-if="!passwordResetEmail" @click="resetPassword" class="btn btn-outline-danger">Reset Password</button>
                                        <span class="form-text" v-else>Password reset link sent to {{ currentAuthEmail }}</span>
                                    </div>
                                </div>
                                <div class="form-group row ml-0 mr-0">
                                    <label for="apikey" class="col-md-2 col-form-label">API Key</label>
                                    <div class="col-md-10">
                                        <input disabled type="text" class="form-control col-12" id="apikey" :value="user.uid">
                                    </div>
                                </div>
                                <div v-if="accountPassword" class="form-group row ml-0 mr-0">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-10">
                                        <button @click="updateProfile" class="btn btn-outline-info">Update Profile</button>
                                        <span v-if="profileUpdated" class="form-text text-success">Profile Updated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <transition name="fade">
            <div v-if="promptPassword" id="promptPassword">
                <div class="modal d-block">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Please re-enter your password.</h5>
                            <button @click="promptPassword = false" type="button" class="close"><span>&times;</span></button>
                        </div>
                        <div class="modal-body form-group">
                            <input type="password" class="form-control" v-model="password">
                        </div>
                        <div class="modal-footer">
                            <button @click="submitPassword" type="button" class="btn btn-outline-success">Continue</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </section>
</template>
<script>
    import firebase from 'firebase';

    export default {
        data() {
            return {
                user: this.$store.state.user,
                currentAuthEmail: this.$store.state.user.email,
                currentDisplayName: this.$store.state.user.displayName,
                passwordResetEmail: false,
                profileUpdated: false,
                promptPassword: false,
                password: ''
            }
        },
        computed: {
            accountPassword: function () {
                return true ? this.user.providerData[0].providerId == 'password' : false;
            },
            accountPic: function() {
                if(this.accountPassword){
                    return 'col-12'
                 } else {
                    return 'col-md-8';
                 }
            }
        },
        methods: {
            resetPassword: function() {
                const authEmail = this.currentAuthEmail;
                console.log(authEmail);
                firebase.auth().sendPasswordResetEmail(authEmail).then( () => {
                    this.passwordResetEmail = true;
                }).catch(function (error) {
                    alert(error);
                });
            },
            updateProfile: function() {
                const user = firebase.auth().currentUser;
                const self = this;
                console.log(user);
                //Reset profileUpdated data var
                this.profileUpdated = false;
                
                //Check if email was changed
                if(self.currentAuthEmail != self.user.email){
                    //Update Email
                    user.updateEmail(self.user.email).then(() => {
                        self.profileUpdated = true;
                        self.promptPassword = false;
                        self.$store.dispatch('updateUser', self.user);
                    }).catch(function (error) {
                        console.log(error);
                        if(error.code == 'auth/requires-recent-login'){
                            self.promptPassword = true;
                        }
                    });
                }

                //Check if displayName was changed
                if (self.currentDisplayName != self.user.displayName) {
                    user.updateProfile({
                        displayName: self.user.displayName,
                        photoURL: self.user.photoURL
                    }).then(function (response) {
                        self.profileUpdated = true;
                        self.$store.dispatch('updateUser', self.user);
                    }).catch(function (error) {
                        alert(error);
                    });
                }
            },
            submitPassword: function() {
                firebase.auth().signInWithEmailAndPassword(this.currentAuthEmail, this.password)
                .then(this.updateProfile())
                .catch(function (error) {
                    alert(error)
                });
            }
        }
    }
</script>