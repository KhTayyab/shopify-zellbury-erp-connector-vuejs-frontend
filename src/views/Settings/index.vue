<template>
    <div>
        <Navbar />
        <v-main>
            <!-- Expension Panel -->
            <!-- POS Integration -->
            <v-row>
                <v-col cols="12" sm="12">
                    <v-card tile elevation="2" class="mt-3 inventory_sync">
                        <v-card-title>
                            <v-row>
                                <v-col cols="12" sm="2">
                                    Location Setup
                                </v-col>
                                <v-col cols="12" sm="10">
                                    <v-card-actions>
                                        <v-btn color="primary" depressed @click="pushItemInLocationDetails()">+ Add Row</v-btn>    
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-progress-linear :active="location_detail_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                        <div v-if="location_detail_loading == false">
                            <v-card-text>
                                <table class="custom-table">
                                    <thead>
                                        <tr>
                                            <th class="text-center custom-table-col-width">Gtech Location</th>
                                            <th class="text-center custom-table-col-width">Shopify Location</th>
                                            <th class="text-center custom-table-col-width">Inventory Threshold</th>
                                            <th class="text-center custom-table-col-width">Integration Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in location_details" :key="item.id">
                                            <td class="text-center">
                                                <v-text-field class="custom-table-form" v-model="item.gtech_location" label="Gtech Location"></v-text-field>
                                            </td>
                                            <td class="text-center">
                                                <v-select class="custom-table-form" v-model="item.shopify_location" :items="locations" :item-text="'name'" :item-value="'id'" label="Shopify Location"></v-select>
                                            </td>
                                            <td class="text-center">
                                                <v-text-field type="number" min=0 max=100 class="custom-table-form" v-model="item.inv_percentage" label="Inventory Threshold Percentage"></v-text-field>
                                            </td>
                                            <td class="text-center">
                                                <v-checkbox class="custom-table-form" v-model="item.is_active" label="Status"></v-checkbox>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <v-card-actions style="margin-top: 2%;">
                                    <v-btn color="primary" depressed @click="saveLocationDetail()">Save & Update</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="sale_module == true">
                <v-col cols="12" sm="12">
                    <v-card class="order-verification" tile elevation="2">
                        <v-card-title>
                            Product Creation API Information
                        </v-card-title>
                        <v-progress-linear :active="token_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                        <div v-if="token_loading == false">
                            <v-card-text>
                                <v-card-text class="text--primary">
                                    <div class="teal--text"><b>API KEY:</b> {{api_token.custom_api_token}}</div>
                                    <div class="red--text"><b>Note:</b> If token re-generated and update token on integration side</div>
                                    <div class="indigo--text"><b>Note:</b> If Call Status in Response is 1 then Order marked as Verified</div>
                                </v-card-text>
                                <v-card-text class="text--primary">
                                    <div class="teal--text"><b>End Point:</b> {{api_details.url}}</div>
                                    <div class="indigo--text"><b>Header:</b> X-Access-Token: {{api_token.custom_api_token}}</div>
                                    <div class="red--text"><b>Body:</b> {{api_details.body}}</div>
                                </v-card-text>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" depressed @click="openTokenDialog()">Generate API Token</v-btn>
                            </v-card-actions>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="sale_module == true">
                <v-col cols="12" sm="8">
                    <template>
                        <v-card tile elevation="2" class="mt-3 inventory_sync">
                            <v-card-title>
                                Apply and Remove Sale
                            </v-card-title>
                            <v-progress-linear :active="sale_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                            <div v-if="sale_loading == false">
                                <v-card-text>
                                    <v-radio-group v-model="sale_type">
                                        <v-radio label="Barcode" value="barcode" color="#125443"></v-radio>
                                        <v-radio label="SKU" value="sku" color="#125443"></v-radio>
                                    </v-radio-group>
                                    <v-text-field v-model="sale_tag" label="Sale tag like 'Sale 2022'"></v-text-field>
                                    <v-file-input label="Select file" @change="handleFileUpload" color="#000"></v-file-input>
                                    <div class="mt-3">
                                        <p class="mb-1">Selected file: {{ fileName }}</p>
                                    </div>
                                    <div>
                                        <p style="color: red;"> Kindly see the data format by downloading the sample file, otherwise sale script will not work properly. </p>
                                    </div>
                                    <v-card-actions>
                                        <v-btn color="primary" depressed @click="fileUploadWithSaleProcess('apply_sale')">Upload file & Apply Sale</v-btn>
                                        <v-btn color="primary" depressed @click="fileUploadWithSaleProcess('remove_sale')">Upload file & Remove Sale</v-btn>
                                    </v-card-actions>
                                </v-card-text>
                            </div>
                        </v-card>
                    </template>
                </v-col>
                <v-col cols="12" sm="4" style="margin-top: 0.75%;">
                    <template>
                        <v-card class="order-verification" tile elevation="2">
                            <v-card-title>Apply/Remove Sale File Sample</v-card-title>
                            <v-card-text>
                            <div>
                                <p style="color: red;"> Follow sample csv to upload sale data. Press the download button to see the format of sale file. </p>
                            </div>
                            <div>
                                <h3>Apply Sale Sample File</h3>
                                <v-btn class="mt-3" color="primary" @click="downloadSampleBarcodeFile('apply_sale')">Barcode Sample File</v-btn>
                                <v-btn class="mt-3 ml-3" color="primary" @click="downloadSampleSKUfile('apply_sale')">SKU Sample File</v-btn>
                            </div>
                            <br/>
                            <div>
                                <h3>Remove Sale Sample File</h3>
                                <v-btn class="mt-3" color="primary" @click="downloadSampleBarcodeFile('remove_sale')">Barcode Sample File</v-btn>
                                <v-btn class="mt-3 ml-3" color="primary" @click="downloadSampleSKUfile('remove_sale')">SKU Sample File</v-btn>
                            </div>
                            </v-card-text>
                        </v-card>`
                    </template>
                </v-col>
            </v-row>
            <!-- Expension Panel -->
            <v-card tile elevation="2" class="mt-3">
                <v-card-title>Scenarios</v-card-title>
                <v-expansion-panels v-model="openedPanel" flat multiple focusable>
                    <!-- Order Posting -->
                    <v-expansion-panel>
                        <v-expansion-panel-header>Order Posting</v-expansion-panel-header>
                        <v-progress-linear :active="order_creation_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                        <v-expansion-panel-content v-if="order_creation_loading == false">
                            <v-form ref="form">
                                <v-row>
                                    <v-col sm="6">
                                        <v-switch v-model="order_creation_option.order_creation" label="Enable"></v-switch>
                                        <v-select :items="triggers" v-model="order_creation_option.event_trigger" name="event_trigger" item-text="event_trigger" label="Event Trigger" />
                                    </v-col>
                                    <v-col sm="6">
                                        <v-text-field v-model="order_creation_option.shopify_tag" label="Add Tag"></v-text-field>
                                        <v-switch v-model="order_creation_option.append_tag" label="Append Tag"></v-switch>
                                    </v-col>
                                </v-row>

                                <div class="text-right">
                                    <v-btn small depressed class="mr-4" @click="closePanel(0)">Cancel</v-btn>
                                    <v-btn small color="primary" depressed @click="saveOrderCreationOption()">Save</v-btn>
                                </div>
                            </v-form>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- CN Generation -->
                    <v-expansion-panel>
                        <v-expansion-panel-header>CN Generation (if order posting event is on order creation than it will work)</v-expansion-panel-header>
                        <v-progress-linear :active="fulfillment_creation_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                        <v-expansion-panel-content v-if="fulfillment_creation_loading == false">
                            <v-form ref="form">
                                <v-row>
                                    <v-col sm="6">
                                        <v-switch v-model="fulfillment_creation_option.fulfillment_creation" label="Enable"></v-switch>
                                    </v-col>
                                    <v-col sm="6">
                                        <v-text-field v-model="fulfillment_creation_option.shopify_tag" label="Add Tag"></v-text-field>
                                        <v-switch v-model="fulfillment_creation_option.append_tag" label="Append Tag"></v-switch>
                                    </v-col>
                                </v-row>
                                <div class="text-right">
                                    <v-btn small depressed class="mr-4" @click="closePanel(0)">Cancel</v-btn>
                                    <v-btn small color="primary" depressed @click="saveOrderFulfilmentOption()">Save</v-btn>
                                </div>
                            </v-form>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- Order Cancellation -->
                    <v-expansion-panel>
                        <v-expansion-panel-header>Order Cancellation</v-expansion-panel-header>
                        <v-progress-linear :active="order_cancellation_loading" color="primary accent-4" indeterminate rounded></v-progress-linear>
                        <v-expansion-panel-content v-if="order_cancellation_loading == false">
                            <v-form ref="form">
                                <v-row>
                                    <v-col sm="6">
                                        <v-switch v-model="order_cancellation_option.order_cancellation" label="Enable"></v-switch>
                                    </v-col>
                                    <v-col sm="6">
                                        <v-text-field v-model="order_cancellation_option.shopify_tag" label="Add Tag"></v-text-field>
                                        <v-switch v-model="order_cancellation_option.append_tag" label="Append Tag"></v-switch>
                                    </v-col>
                                </v-row>
                                <div class="text-right">
                                    <v-btn small depressed class="mr-4" @click="closePanel(0)">Cancel</v-btn>
                                    <v-btn small color="primary" depressed @click="saveOrderCancellationOption()">Save</v-btn>
                                </div>
                            </v-form>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>

            <!-- Integration Dialog -->
            <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="primary" depressed class="mb-2 mt-8" v-bind="attrs" v-on="on">+ Add Integration</v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ formTitle }}</v-card-title>
                    <v-card-text v-if="pos_integration_loading == true">
                        <v-progress-circular indeterminate color="primary" style="margin-left: 44%;"></v-progress-circular>
                    </v-card-text>
                    <div v-if="pos_integration_loading == false">
                        <v-card-text>
                            <v-select :items="service_pos" v-model="pos_integration.integration_name" label="POS" dense></v-select>
                            <v-text-field v-model="pos_integration.api_endpoint" label="End Point URL" ></v-text-field>
                            <v-text-field v-model="pos_integration.api_key" label="API KEY" ></v-text-field>
                            <v-radio-group v-model="pos_integration.unique_identifier">
                                <template v-slot:label>
                                    <div>Your Store <strong>Unique Identifier</strong></div>
                                </template>
                                <v-radio value="SKU">
                                    <template v-slot:label>
                                        <div><strong class="success--text">SKU</strong></div>
                                    </template>
                                </v-radio>
                                <v-radio value="Barcode">
                                    <template v-slot:label>
                                        <div><strong class="primary--text">Barcode</strong></div>
                                    </template>
                                </v-radio>
                            </v-radio-group>
                            <v-checkbox v-model="pos_integration.enable_inv_sync" :label="`Enable Inventory Sync`"></v-checkbox>
                            <v-checkbox v-model="pos_integration.enable_price_sync" :label="`Enable Price Sync`"></v-checkbox>
                            <v-checkbox v-model="pos_integration.enable_order_posting" :label="`Enable Order Posting`"></v-checkbox>
                            <v-checkbox v-model="pos_integration.schedule_inv_sync" :label="`Auto Inventory Schedule`"></v-checkbox>
                            <v-checkbox v-model="pos_integration.schedule_price_sync" :label="`Auto Price Schedule`"></v-checkbox>
                            <v-text-field v-model="pos_integration.shopify_api_key" label="Shopify API KEY" ></v-text-field>
                            <v-text-field v-model="pos_integration.shopify_api_password" label="Shopify API Password" ></v-text-field>
                            <v-text-field v-model="pos_integration.shopify_api_access_token" label="Shopify Access Token" ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn small depressed class="mr-2" @click="close">Cancel</v-btn>
                            <v-btn small color="primary" depressed @click="savepos()">Save</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            <v-card tile elevation="2" class="mt-2">
                <v-card-title>Integrations</v-card-title>
                <v-data-table :loading="pos_integration_loading" loading-text="Loading... Please wait" :headers="headers" :items="pos_list" sort-by="id">
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
                                <v-icon small class="mr-2" @click="testIntegration(item)" v-bind="attrs" v-on="on">
                                    mdi-connection
                                </v-icon>
                            </template>
                            <span>Test connection</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="inventorySync(item)" v-bind="attrs" v-on="on">
                                    mdi-sync-circle
                                </v-icon>
                            </template>
                            <span>Sync Inventory</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="priceSync(item)" v-bind="attrs" v-on="on">
                                    mdi-sync-alert
                                </v-icon>
                            </template>
                            <span>Sync Price</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="compareAtPriceSync(item)" v-bind="attrs" v-on="on">
                                    mdi-sync
                                </v-icon>
                            </template>
                            <span>Sync Compare at Price</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="mr-2" @click="combinePriceSync(item)" v-bind="attrs" v-on="on">
                                    mdi-cloud-sync
                                </v-icon>
                            </template>
                            <span>Sync Combine Price</span>
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
                        <v-btn color="primary" @click="initialize">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <!-- Delete Dialog -->
            <v-dialog v-model="delete_dialog" max-width="500px">
                <v-card>
                    <v-card-title>Delete Integration</v-card-title>
                    <v-card-text>Are you sure you want to delete shop no {{delete_pos_integration.app_shop}} from integration?</v-card-text>
                    <v-card-actions>
                        <v-btn small depressed class="mr-2" @click="closeDeleteDialog()">Cancel</v-btn>
                        <v-btn small color="primary" depressed @click="deleteIntegration()">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Token Dialog -->
            <v-dialog v-model="token_dialog" max-width="500px">
                <v-card>
                    <v-card-title>Generate API Token</v-card-title>
                    <v-card-text>Are you sure you want to generate api token?</v-card-text>
                    <v-card-actions>
                        <v-btn small depressed class="mr-2" @click="closeTokenDialog()">Cancel</v-btn>
                        <v-btn small color="primary" depressed @click="generateAPIToken()">Generate Token</v-btn>
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

<style lang="scss" src="./Settings.scss"></style>

<script src="./Settings.js"></script>
