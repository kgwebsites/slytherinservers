<template>
    <section id="app-account">
        <div class="container-fluid">
            <div class="row">
                <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                    <h1>Contact Requests</h1>

                    <p v-if="requests.length == 0">None yet, check out the docs and set up your first test!</p>

                    <div class="table-responsive" v-else>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(request, key) in requests">
                                    <td>{{ request.date_entered }}</td>
                                    <td>{{ request.name.first }} {{ request.name.last }}</td>
                                    <td>{{ request.email }}</td>
                                    <td>{{ request.phone }}</td>
                                    <td>{{ request.subject }}</td>
                                    <td><button type="button"
                                            class="btn btn-primary"
                                            @click="viewMessage(request.subject,request.message)">
                                            View Message
                                    </button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
        <!-- Message Modal -->
        <div v-if="message != ''" class="modal fade d-block show" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ subject }}</h5>
                        <button type="button" class="close" @click="closeMessage">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{ message }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="closeMessage" class="btn btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                requests: this.$store.state.requests,
                message: '',
                subject: ''
            }
        },
        methods: {
            viewMessage(subject,message) {
                this.subject = subject;
                this.message = message;
            },
            closeMessage() {
                this.message = "";
            }
        },
        created(){
            this.$http.post('account/requests', this.$store.state.user)
                .then(response => {
                    if (response.data.status == 200) {
                        if(response.data.requests != null){
                            let requests = response.data.requests;
                            let requestsArray = Object.values(requests);
                            let desc = requestsArray.slice(0);
                            desc.sort(function(a,b) {
                                return a.timestamp - b.timestamp;
                            });
                            this.requests = desc;
                            this.$store.dispatch('updateRequests', desc);
                        }
                    } else {
                        alert(response.data.error[0].msg);
                    }
                }, error => {
                    alert('Failed to connect to server. Please try a different internet connection.');
                });
        }
    }
</script>
<style scoped>
    .table-striped th{
        border-top: 0;
    }
</style>