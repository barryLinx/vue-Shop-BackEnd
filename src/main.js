// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'

import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
import Loading from 'vue-loading-overlay';
import moment from "moment";
import VueMomentJS from "vue-momentjs";
import 'vue-loading-overlay/dist/vue-loading.min.css';


import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import TimeStampToDate from './filters/TimeStampToDate';

Vue.use(VueAxios,axios);
VeeValidate.Validator.localize('zh_TW',zhTWValidate)
Vue.use(VeeValidate);
Vue.use(VueMomentJS, moment);
//Vue.use(vue-moment);
Vue.config.productionTip = false

Vue.component('Loading', Loading); //全域
Vue.filter('currency',currencyFilter);
Vue.filter('TimeStamp',TimeStampToDate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to,from,next)=>{
 console.log('to',to,'from',from,'next',next);
  
  if (to.meta.requiresAuth) {
   // console.log('要驗證');
    const api = `${process.env.APIPATH}/api/user/check`;
    const vm =  this;
    axios.post(api).then((response) => {
      console.log(response.data);
      if (response.data.success) {
       //this.$router.push('/admin/products');
       next();
        
      }
      else{
        next({
          path:'/signin',
        });        
      }
    })
  }else{
    next();
  }


});
