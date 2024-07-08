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
                                    <v-list-item-title @click="downloadOrderLogs()">Download CSV</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                    <v-btn small color="black" v-on:click="openOrderQueueDialog" depressed v-bind="attrs" v-on="on">+ Add Data</v-btn>
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
            <!-- Order Queue Dialog -->
            <v-dialog v-model="order_queue_dialog" max-width="600px">
                <v-card>
                    <v-card-title>Order Queue</v-card-title>
                    <v-card-text v-if="order_queue_loading == true">
                        <v-progress-circular indeterminate color="black" style="margin-left: 44%;"></v-progress-circular>
                    </v-card-text>
                    <div v-if="order_queue_loading == false">
                        <v-card-text>
                            <v-select :items="queue_list" v-model="order_queue.webhook" label="Webhook" dense></v-select>
                            <v-text-field v-model="order_queue.order_id" label="Order ID" ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn small depressed class="mr-2" @click="closeOrderQueueDialog()">Cancel</v-btn>
                            <v-btn small color="black" depressed @click="saveOrderQueue()">Save</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            <v-data-table :loading="loading_data" loading-text="Loading... Please wait" :headers="headers" :items="order_logs" :items-per-page="itemsPerPage" :search="search" v-model="selected" item-key="id" class="elevation-1">
                <template v-slot:body.prepend>
                    <tr>
                        <td>
                            <v-text-field v-model="order_id" type="text" label="Order ID"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="status" type="text" label="Status"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="web_hook" type="text" label="Web Wook"></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="status_message" type="text" label="Response"></v-text-field>
                        </td>
                    </tr>
                </template>
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
                <template v-slot:item.created_at="{ item }">
                    <span>{{new Date(item.created_at).toLocaleString()}}</span>
                </template>
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
                        <v-list v-if="item.status == 'failed' || item.status == 'InProcess'">
                            <v-list-item @click="repostItem(item)">
                                <v-list-item-title>Re-post Item</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
        </div>
    </v-main>
</div>
</template>

<style lang="scss" src="./OrderQueues.scss"></style>

<script src="./OrderQueues.js"></script>
