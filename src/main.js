
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
// Vue.prototype.$backendURL = "https://zellbury-backend.alche.cloud"
Vue.prototype.$backendURL = "https://erp-backend.zellbury.com"

// Vue.prototype.$API_TOKEN = "Token%20f5a0d2aaf674e902525a5669b9aab3a319d106c7";
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
