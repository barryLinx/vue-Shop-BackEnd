<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    //const api = 'https://vue-course-api.hexschool.io/api/barry/products';
     const api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/products`;
    // this.$http.get(api).then((response) => {
    //   console.log(response);
    // })
  },
}
</script>

<style lang="scss">
@import "./assets/all.scss";
</style>
