<template>
    <div>
        <Navbar />
        <v-main>
            <!-- 3pl Dialog -->
            <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="black" depressed class="mb-2 mt-8" v-bind="attrs" v-on="on">+ Add 3PL</v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ formTitle }}</v-card-title>
                    <v-card-text v-if="three_pl_loading == true">
                        <v-progress-circular indeterminate color="black" style="margin-left: 44%;"></v-progress-circular>
                    </v-card-text>
                    <div v-if="three_pl_loading == false">
                        <v-card-text>
                            <v-text-field v-model="webhook_url" readonly label="Webhook URL" ></v-text-field>
                            <v-text-field v-model="three_pl.name_3pl" label="3pl name" ></v-text-field>
                            <!-- <v-text-field v-model="three_pl.tracking_path_3pl" label="3pl tracking path" ></v-text-field> -->
                            <v-text-field v-model="three_pl.status_path_3pl" label="3pl status path" ></v-text-field>
                            <v-text-field v-model="three_pl.order_fulfillment_id_path" label="fulfillment id path" ></v-text-field>
                            
                        </v-card-text>
                        <v-card-actions>
                            <v-btn small depressed class="mr-2" @click="close">Cancel</v-btn>
                            <v-btn small color="black" depressed @click="save3pl()">Save</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            <v-card tile elevation="2" class="mt-2">
                <v-card-title>3PLs</v-card-title>
                <v-data-table :loading="three_pl_loading" loading-text="Loading... Please wait" :headers="headers" :items="three_pl_list" sort-by="id">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="editItem(item)" v-bind="attrs" v-on="on">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small @click="deleteItem(item)" v-bind="attrs" v-on="on">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="black" @click="initialize">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <!-- Delete Dialog -->
            <v-dialog v-model="delete_dialog" max-width="500px">
                <v-card>
                    <v-card-title>Delete 3PL Account</v-card-title>
                    <v-card-text>Are you sure you want to delete 3PL account?</v-card-text>
                    <v-card-actions>
                        <v-btn small depressed class="mr-2" @click="closeDeleteDialog()">Cancel</v-btn>
                        <v-btn small color="black" depressed @click="delete3PL()">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
            <!-- exclusion Dialog -->
            <v-dialog v-model="exclusion_dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="black" depressed class="mb-2 mt-8" v-bind="attrs" v-on="on">+ Add Exclusion Event</v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ formTitleExclusion }}</v-card-title>
                    <v-card-text v-if="exclusion_loading == true">
                        <v-progress-circular indeterminate color="black" style="margin-left: 44%;"></v-progress-circular>
                    </v-card-text>
                    <div v-if="exclusion_loading == false">
                        <v-card-text>
                            <v-select v-model="exclusion_event.name_3pl" :items="three_pl_names_list" label="Select 3PL"></v-select>
                            <v-text-field v-model="exclusion_event.event_name" label="Exclusion Event" ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn small depressed class="mr-2" @click="close_exclusion_dialog">Cancel</v-btn>
                            <v-btn small color="black" depressed @click="saveExclusionEvents()">Save</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            <v-card tile elevation="2" class="mt-2">
                <v-card-title>Exclusion List</v-card-title>
                <v-data-table :loading="exclusion_loading" loading-text="Loading... Please wait" :headers="headers_exclusion" :items="exclusion_list" sort-by="id">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="editItemExclusion(item)" v-bind="attrs" v-on="on">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small @click="deleteItemExclusion(item)" v-bind="attrs" v-on="on">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="black" @click="initialize">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <v-dialog v-model="delete_exclusion_dialog" max-width="500px">
                <v-card>
                    <v-card-title>Delete Exclusion Event</v-card-title>
                    <v-card-text>Are you sure you want to delete?</v-card-text>
                    <v-card-actions>
                        <v-btn small depressed class="mr-2" @click="closeDeleteDialogExclusion()">Cancel</v-btn>
                        <v-btn small color="black" depressed @click="deleteExclusion()">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!-- Mapping list -->
            <v-dialog v-model="mapping_dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="black" depressed class="mb-2 mt-8" v-bind="attrs" v-on="on">+ Add Mapping Event</v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ formTitleMapping }}</v-card-title>
                    <v-card-text v-if="mapping_loading == true">
                        <v-progress-circular indeterminate color="black" style="margin-left: 44%;"></v-progress-circular>
                    </v-card-text>
                    <div v-if="mapping_loading == false">
                        <v-card-text>
                            <v-select v-model="mapping_event.name_3pl" :items="three_pl_names_list" label="Select 3PL"></v-select>
                            <v-text-field v-model="mapping_event.three_pl_event" label="3PL Event" ></v-text-field>
                            <v-text-field v-model="mapping_event.shopify_event" label="Shopify Event" ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn small depressed class="mr-2" @click="close_mapping_dialog">Cancel</v-btn>
                            <v-btn small color="black" depressed @click="saveMappingEvents()">Save</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            <v-card tile elevation="2" class="mt-2">
                <v-card-title>Mapping List</v-card-title>
                <v-data-table :loading="mapping_loading" loading-text="Loading... Please wait" :headers="headers_mapping" :items="mapping_list" sort-by="id">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="editItemMapping(item)" v-bind="attrs" v-on="on">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small @click="deleteItemMapping(item)" v-bind="attrs" v-on="on">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="black" @click="initialize">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <v-dialog v-model="delete_mapping_dialog" max-width="500px">
                <v-card>
                    <v-card-title>Delete Mapping Event</v-card-title>
                    <v-card-text>Are you sure you want to delete?</v-card-text>
                    <v-card-actions>
                        <v-btn small depressed class="mr-2" @click="closeDeleteDialogMapping()">Cancel</v-btn>
                        <v-btn small color="black" depressed @click="deleteMapping()">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>



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
    </div>
</template>

<style lang="scss" src="./FulfillmentEvents.scss"></style>

<script src="./FulfillmentEvents.js"></script>
