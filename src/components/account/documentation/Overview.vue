<template>
    <section id="app-account">
        <div class="container-fluid">
            <div class="row">
                <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                    <h1>Overview</h1>

                    <section class="placeholders">
                        <h2>Documentation that's as easy as copy and paste</h2>     
                        <p>Just make a post request to "https://serverless.io/contact" with the parameters below to store a new request:</p>
                        <pre class="prettyprint">
apikey: "{{ $store.state.user.uid }}",
first_name: "[REQUEST FIRST NAME]",
last_name: "[REQUEST LAST NAME]",
email: "[REQUEST EMAIL]",
phone: "[REQUEST PHONE]",
subject: "[REQUEST SUBJECT]",
message: "[REQUEST MESSAGE]"</pre>                   
                    </section>

                </main>
            </div>
        </div>
    </section>
</template>
<style scoped>
pre{
    font: 14px/20px Roboto Mono,monospace;
    border: 0;
    margin: 16px 0;
    overflow-x: auto;
    padding: 8px;
    position: relative;
    background: #f7f7f7;
    color: #37474f;
}
</style>