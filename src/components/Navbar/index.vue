<template>
  <v-app-bar id="navbar" color="indigo darken-2" dense>
    <ul>
      <li>
        <router-link to="/" exact-active-class="active">Orders</router-link>
      </li>
      <li>
        <router-link to="/logs" exact-active-class="active">Logs</router-link>
      </li>
      <li>
        <router-link to="/order_queue" exact-active-class="active">Orders Queue</router-link>
      </li>
      <li>
        <router-link to="/inventory-sync" exact-active-class="active">Inventory Logs</router-link>
      </li>
      <li>
        <router-link to="/price-sync" exact-active-class="active">Price Logs</router-link>
      </li>
      <li>
        <router-link to="/transaction-logs" exact-active-class="active">Transaction Logs</router-link>
      </li>
      <!-- <li>
        <router-link to="/sale-logs" exact-active-class="active">Sale Logs</router-link>
      </li> -->
      <li>
        <router-link to="/settings" exact-active-class="active">Setting</router-link>
      </li>
    </ul>
  </v-app-bar>
</template>

<style lang="scss" src="./Navbar.scss"></style>

<script src="./Navbar.js"></script>
