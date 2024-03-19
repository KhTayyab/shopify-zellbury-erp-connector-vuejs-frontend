import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../views/Orders'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Orders',
    component: Orders
  }, {
    path: '/logs',
    name: 'Logs',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route 
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "logs" */ '../views/Logs/index.vue')
  }, {
    path: '/order_queue',
    name: 'OrderQueues',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route 
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "logs" */ '../views/OrderQueues/index.vue')
  }, {
    path: '/transaction-logs',
    name: 'TransactionLogs',
    component: () => import('../views/TransactionLogs/index.vue')
  }, {
    path: '/sale-logs',
    name: 'SaleLogs',
    component: () => import('../views/SaleLogs/index.vue')
  }, {
    path: '/inventory-sync',
    name: 'InventorySync',
    component: () => import('../views/InventorySync/index.vue')
  }, {
    path: '/price-sync',
    name: 'PriceSync',
    component: () => import('../views/PriceSync/index.vue')
  },{
    path: '/fulfillment-events',
    name: 'FulfillmentEvents',
    component: () => import('../views/FulfillmentEvents/index.vue')
  }, {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings/index.vue')
  }, {
    path: '/error',
    name: 'Error',  
    component: () => import('../views/Error/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
