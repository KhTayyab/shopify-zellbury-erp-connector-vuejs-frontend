<template>
<div>
    <Navbar />
    <v-main>
        <div class="table-wrapper no-pagination">
            <div class="table-actions-row">
                <div class="table-search">
                    <v-text-field label="Search" @input="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                </div>
                <div class="table-actions">
                    <v-btn small outlined color="primary" @click="showFilters = !showFilters">
                        <v-icon>mdi-filter-outline</v-icon> Filters
                    </v-btn>
                    <v-btn small v-on:click="getorders" color="primary" outlined>
                        <v-icon>mdi-refresh</v-icon> Refresh list
                    </v-btn>
                    <!--
                        <div class="bulk-actions">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small color="primary" depressed v-bind="attrs" v-on="on">Bulk Action <v-icon>mdi-menu-down</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>Bulk Action</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    -->
                </div>
            </div>
            <div class="table-filters-row" v-if="showFilters">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small outlined v-bind="attrs" v-on="on">Fulfillment status</v-btn>
                    </template>

                    <v-list>
                        <v-list-item v-for="item in fulfillment_filter_list" :key="item.name">
                            <v-checkbox @change="handleFilterAdd(item.name, 'fulfillment_filter')" :value="fulfillment_filter === item.name" :label="item.title"></v-checkbox>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small outlined v-bind="attrs" v-on="on">Payment status</v-btn>
                    </template>

                    <v-list>
                        <v-list-item v-for="item in payment_status_list" :key="item.name">
                            <v-checkbox @change="handleFilterAdd(item.name, 'payment_filter')" :value="payment_filter === item.name" :label="item.title"></v-checkbox>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <v-data-table :loading="loading_data" loading-text="Loading... Please wait" :headers="headers" :items="orders" disable-pagination disable-sort :items-per-page="itemsPerPage" item-key="id" class="elevation-1">
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getColor(item.status)" label v-if="item.status">{{ item.status }}</v-chip>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="editPhoneDialog(item)">
                                <v-list-item-title>Edit Phone</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
            <div class="table-pagnation">
                <div class="per-page">
                    <span>Rows per page:</span>
                    <v-select v-model="itemsPerPage" :items="perPageOptions" @change="handleFilterAdd($event, 'limit_filter')" label=""></v-select>
                </div>
                <div class="pager">
                    <v-btn icon :disabled="!previous_page_url" v-on:click="getPreviousPageOrders">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-btn icon :disabled="!next_page_url" v-on:click="getNextPageOrders">
                        <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
        <!-- Snack Bar -->
        <v-snackbar v-model="snackbar" :timeout="snackbar_timeout">
            {{ snackbar_text }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-main>
    <!-- Update Order Phone Dialog -->
    <v-dialog v-model="phone_dialog" max-width="500">
        <v-card>
            <v-card-title> Fix Phone Number </v-card-title>
            <v-card-text v-if="phone_number_loading == true">
                <v-progress-circular indeterminate color="primary" style="margin-left: 44%;"></v-progress-circular>
            </v-card-text>
            <div v-if="phone_number_loading == false">
                <v-card-text>
                    <v-text-field v-model="update_phone_content.phone" label="Phone number"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed @click="closePhoneDialog()">Cancel</v-btn>
                    <v-btn color="primary" depressed @click="updateOrderPhone()">Update</v-btn>
                </v-card-actions>
            </div>
        </v-card>
    </v-dialog>
</div>
</template>

<style lang="scss" src="./Orders.scss"></style>

<script src="./Orders.js"></script>
