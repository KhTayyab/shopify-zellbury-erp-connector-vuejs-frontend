
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

var url_params = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
  url_params[key] = value;
});

Vue.prototype.$API_TOKEN = url_params.API_TOKEN;
Vue.prototype.$shop = url_params.shop;
Vue.prototype.$plan_name = "Free"
Vue.prototype.$sale_module = true
Vue.prototype.$backendURL = "https://erp-backend.zellbury.com"

// Vue.prototype.$API_TOKEN = "Token%20da3ec62265d81bcd466c5f8882281e9f077f523c";
// Vue.prototype.$shop = "alche-app-development.myshopify.com";
// Vue.prototype.$shop = "eb8588-2.myshopify.com";
// Vue.prototype.$plan_name = "Free";
// Vue.prototype.$sale_module = true;
// Vue.prototype.$backendURL = "http://localhost:8000"

Vue.prototype.$Axios = Axios

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')


if (url_params.API_TOKEN.includes("+") == true) {
  var queryString = window.location.search
  var urlParams = new URLSearchParams(queryString);
  Vue.prototype.$API_TOKEN = urlParams.get('API_TOKEN');
  router.push('/settings')
}