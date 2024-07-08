<template>
    <div>
        <Navbar />
        <v-main>
    
            <div class="table-wrapper">
                <div class="table-actions-row">
                    <div class="table-search">
                        <v-text-field label="Search" v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                    </div>
    
                    <div class="table-actions">
                        <v-btn small outlined color="black" @click="showFilters = !showFilters">
                            <v-icon>mdi-filter-outline</v-icon> Filters
                        </v-btn>
                        <v-btn small v-on:click="getlogs" color="black" outlined>
                            <v-icon>mdi-refresh</v-icon> Refresh list
                        </v-btn>
                        <div class="bulk-actions">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small color="black" depressed v-bind="attrs" v-on="on">Download <v-icon>mdi-menu-down</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title @click="downloadLogs()">Download CSV</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </div>
                </div>
                <div class="table-filters-row" v-if="showFilters">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-container>
                                <v-row v-bind="attrs" v-on="on">
                                    <v-col cols="12" md="3">
                                        <v-menu v-model="menu1" :close-on-content-click="false" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field :value="startDateFormat" clearable label="Start Date" readonly v-bind="attrs" v-on="on" @click:clear="start_date = null"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="start_date" @change="menu1 = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-menu v-model="menu2" :close-on-content-click="false" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field :value="endDateFormat" clearable label="End Date" readonly v-bind="attrs" v-on="on" @click:clear="end_date = null"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="end_date" @change="menu2 = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </template>
                    </v-menu>
                </div>
                <v-data-table :loading="loading_data" loading-text="Loading... Please wait" :headers="headers" :items="logs" :items-per-page="itemsPerPage" :search="search" v-model="selected" item-key="id" class="elevation-1">
                    <template v-slot:body.prepend>
                    <tr>
                        <td>
                            <v-text-field v-model="courier" type="text" label="Courier"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="status" type="text" label="Status"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="fulfillment_order_id" type="text" label="Fulfillment ID"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="order_id" type="text" label="Order ID"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="event_status" type="text" label="Fulfillment event status"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="shopify_paid_status" type="text" label="Shopify Paid Status"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="gtech_paid_status" type="text" label="Gtech Paid Status"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="message" type="text" label="Message"></v-text-field>
                        </td>
                    </tr>
                </template>
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                    <template v-slot:item.created_at="{ item }">
                        <span>{{new Date(item.created_at).toLocaleString()}}</span>
                    </template>
                    <template v-slot:item.updated_at="{ item }">
                        <span>{{new Date(item.updated_at).toLocaleString()}}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="retry_event(item)" v-bind="attrs" v-on="on">
                                    mdi-sync
                                </v-icon>
                            </template>
                            <span>Retry</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </div>
        </v-main>
    
        <!-- Snack Bar -->
        <v-snackbar v-model="snackbar" :timeout="snackbar_timeout">
            {{ snackbar_text }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
    </template>
    
    <style lang="scss" src="./FulfillmentEvents.scss"></style>
    
    <script src="./FulfillmentEvents.js"></script>
    