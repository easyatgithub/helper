<template>
  <div id="app">
    <login v-on:loginSuccessed="handleLoginSuccessed" v-if="!isLoggedIn"/>
    <bank-information v-if="!isLoggedIn"/>
    <Head  v-if="isLoggedIn"/>
  </div>
</template>

<script>
  import Login from '@/components/Login';
  import BankInformation from '@/components/BankInformation';
  import Head from '@/components/Head';

  export default {
    name: 'session-capture',
    mounted() {
      // We use cookie to reconize if login success
      localStorage.removeItem('cookie');
    },
    components: {
      BankInformation,
      Login,
      Head,
    },
    data: () => ({
      isLoggedIn: true,
    }),
    methods: {
      handleLoginSuccessed() {
        this.isLoggedIn = true;
      },
    },
  };
</script>

<style>
  /* CSS */
</style>
