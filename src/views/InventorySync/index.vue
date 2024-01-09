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
                    <v-btn small outlined color="primary" @click="showFilters = !showFilters">
                        <v-icon>mdi-filter-outline</v-icon> Filters
                    </v-btn>
                    <v-btn small v-on:click="getlogs" color="primary" outlined>
                        <v-icon>mdi-refresh</v-icon> Refresh list
                    </v-btn>
                    <div class="bulk-actions">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small color="primary" depressed v-bind="attrs" v-on="on">Download <v-icon>mdi-menu-down</v-icon>
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
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getColor(item.status)" label v-if="item.status"><span v-if="item.status">Success</span><span v-else>Failed</span></v-chip>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.link="{ item }">
                    <v-btn color="indigo" text @click="copyText(item.link)">Copy</v-btn>
                </template>
                <template v-slot:item.created_at="{ item }">
                    <span>{{new Date(item.created_at).toLocaleString()}}</span>
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

<style lang="scss" src="./InventorySync.scss"></style>

<script src="./InventorySync.js"></script>
