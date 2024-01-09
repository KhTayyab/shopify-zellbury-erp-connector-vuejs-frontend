import Navbar from '@/components/Navbar';
export default {
	name: 'Settings',
	components: {
		Navbar
	},
	data() {
		return {
			/////////////////// External API Token ///////////////////
			api_token: {},
      token_loading: false,
      token_dialog: false,
			/////////////////// External API Token ///////////////////

			sale_module: false,
			triggers: [],
			pos_list: [],
			pos_integration: {},
			delete_pos_integration: {},
			delete_dialog: false,
			dialog: false,
			pos_integration_loading: false,
			pos_loading: false,
			sale_loading: false,
			inventory_loading: false,
			inventory_settings: {
				use_hold_qty: false,
				schedule_sync: false,
				schedule_day: "Daily",
				schedule_time: "00:00",
				location_id: "",
				restrict_tag: ""
			},
			openedPanel: [],
			order_creation_option: {},
			fulfillment_creation_option: {},
			order_cancellation_option: {},
			message_content: {},
			snackbar: false,
			order_creation_loading: false,
			fulfillment_creation_loading: false,
			order_cancellation_loading: false,
			snackbar_text: '',
			snackbar_timeout: 2000,
			schedule_day_list: ['Daily'],
			schedule_time_list: ['9am', '12pm', '3pm', '6pm', '9pm', '12am'],
			locations: [],
			modal2: false,

			/////////////////// Sale/Price File Related Variables ///////////////////
			sale_type: 'barcode',
      fileName: null,
      file:'',
			sale_tag: "",
			/////////////////// Sale/Price File Related Variables ///////////////////

			headers: [{
					text: 'POS',
					align: 'start',
					sortable: false,
					value: 'integration_name',
				}, {
					text: 'Inventory Sync Enable',
					value: 'enable_inv_sync'
				}, {
					text: 'Price Sync Enable',
					value: 'enable_price_sync'
				}, {
					text: 'Enable Order Posting',
					value: 'enable_order_posting'
				}, {
					text: 'Actions',
					value: 'actions',
					sortable: false,
					width: '250px'
				},
			],
			editedIndex: -1,
			editedItem: {
				unique_identifier: '',
				enable_inv_sync: '',
				schedule_inv_sync: '',
				enable_order_posting: '',
				enable_price_sync: '',
				schedule_price_sync: '',
				api_endpoint: '',
				api_key: '',
				shopify_api_key: '',
				shopify_api_password: '',
				shopify_api_access_token: '',
			},
			service_pos: ['Gtech'],
			defaultItem: {
				unique_identifier: '',
				enable_inv_sync: '',
				schedule_inv_sync: '',
				enable_order_posting: '',
				enable_price_sync: '',
				schedule_price_sync: '',
				api_endpoint: '',
				api_key: '',
				shopify_api_key: '',
				shopify_api_password: '',
				shopify_api_access_token: '',
			}
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New Account' : 'Edit Account'
		},
	},
	watch: {
		dialog(val) {
			val || this.close()
		},
	},
	created() {
		this.initialize()
	},
	methods: {
		initialize() {
			this.getPOSIntegration()
			this.getOrderCreationOption()
			this.getFulfillmentCreationOption()
			this.getOrderCancellationOption()
			this.getInventorySettings()
			this.initializeArrayData()
			this.getShopLocations()
			this.initializeSaleModule()
			this.getToken()
			this.generateAPIDetail()
		},
		
		initializeSaleModule() {
      if (this.$sale_module == 'false') {
        this.sale_module = false;
      } else if (this.$sale_module == 'true') {
        this.sale_module = true;
      }
      else {
        this.sale_module = this.$sale_module;
      }
    },

		handleFileUpload(file) {
      if (file) {
        this.file = file
        this.fileName = file.name;
        // Do something with the file, like send it to a server
      } else {
        this.fileName = null;
      }
    },

    initializeArrayData() {
			this.triggers = [
				'Order Creation',
				'Fulfillment Creation'
			]
		},

		// Edit Inetgration Dialog
		editItem(item) {
			this.editedIndex = this.pos_list.indexOf(item)
			this.pos_integration = Object.assign({}, item)
			this.dialog = true
		},

		// Delete Inetgration Dialog
		deleteItem(item) {
			this.delete_pos_integration = Object.assign({}, item)
			this.delete_dialog = true
		},

		// Close Inetgration Dialog
		close() {
			this.dialog = false
			this.$nextTick(() => {
				this.pos_integration = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},

		// Close Delete Dialog Dialog
		closeDeleteDialog() {
			this.delete_dialog = false
		},

		openTokenDialog () {
      this.token_dialog = true
    },

    closeTokenDialog () {
      this.token_dialog = false
    },
    
		// Fetch API Token
    getToken() {
      this.token_loading = true;
      this.$Axios.get(this.$backendURL + "/get_api_token?shop=" + this.$shop, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.api_token = response.data;
        this.token_loading = false;
      }, (error) => {
        console.log(error);
        this.api_token = {}
        this.token_loading = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },
    
		// Generate API Token
    generateAPIToken() {
      this.token_loading = true;
      this.$Axios.get(this.$backendURL + "/generate_api_token?shop=" + this.$shop, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.api_token = response.data;
        this.snackbar = true;
        this.token_loading = false;
        this.closeTokenDialog()
        this.snackbar_text = "Token Generated";
      }, (error) => {
        console.log(error);
        this.api_token = {}
        this.snackbar_text = error;
        this.token_loading = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },

		generateAPIDetail() {
      this.api_details = {
        url: this.$backendURL + "/product_operations/create_product",
        body: {   
					"shop": this.$shop,
					"product": {
						"title": "NOGARA SLIM RED STRIPE SHIRT",
						"body_html": "The red stripe is a true classy. In slim cut and super cottony feel, this red stripe shirt is one you’ll wear time and time again. ",
						"vendor": "NOGARA",
						"product_type": "SHIRT",
						"published_scope": "web",
						"variants": [
							{
								"price": "169.0000000000",
								"sku": "J04041-160335-1",
								"inventory_policy": "deny",
								"compare_at_price": "179.0000000000",
								"fulfillment_service": "manual",
								"inventory_management": "shopify",
								"option1": "39",
								"option2": "RED STRIPE",
								"option3": "",
								"taxable": 1,
								"barcode": "AD00000010481",
								"grams": null,
								"weight": 0,
								"weight_unit": null,
								"requires_shipping": true
							},
							{
								"price": "169.0000000000",
								"sku": "J04041-160335-1",
								"inventory_policy": "deny",
								"compare_at_price": "179.0000000000",
								"fulfillment_service": "manual",
								"inventory_management": "shopify",
								"option1": "40",
								"option2": "RED STRIPE",
								"option3": "",
								"taxable": 1,
								"barcode": "AD00000010482",
								"grams": null,
								"weight": 0,
								"weight_unit": null,
								"requires_shipping": true
							},
							{
								"price": "169.0000000000",
								"sku": "J04041-160335-1",
								"inventory_policy": "deny",
								"compare_at_price": "179.0000000000",
								"fulfillment_service": "manual",
								"inventory_management": "shopify",
								"option1": "41",
								"option2": "RED STRIPE",
								"option3": "",
								"taxable": 1,
								"barcode": "AD00000010483",
								"grams": null,
								"weight": 0,
								"weight_unit": null,
								"requires_shipping": true
							},
							{
								"price": "169.0000000000",
								"sku": "J04041-160335-1",
								"inventory_policy": "deny",
								"compare_at_price": "179.0000000000",
								"fulfillment_service": "manual",
								"inventory_management": "shopify",
								"option1": "42",
								"option2": "RED STRIPE",
								"option3": "",
								"taxable": 1,
								"barcode": "AD00000010484",
								"grams": null,
								"weight": 0,
								"weight_unit": null,
								"requires_shipping": true
							}
						],
						"images": [
							{
								"url": "https://brandsco-my.sharepoint.com/:i:/p/erpsystem/EbZTBvdX21BHspOYnKGaxOIBHq5JS-ZZJJGp1J9BUhct4g?e=hIiitd"
							}
						]
					}
				}
      }
    },

		// Test Connection
		testIntegration(item) {
			this.selected_item = Object.assign({}, item)
			this.pos_integration_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/test_connection?shop=" + this.$shop + "&id=" + this.selected_item.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = response.data.detail;
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Delete Integration
		deleteIntegration() {
			this.order_cancellation_loading = true;
			this.$Axios.delete(this.$backendURL + "/erp_integration/integrations?id=" + this.delete_pos_integration.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				console.log(response);
				this.snackbar = true;
				this.order_cancellation_loading = false;
				this.snackbar_text = "Integration Deleted";
				this.closeDeleteDialog()
				this.getposIntegration()
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.order_cancellation_loading = false;
				this.snackbar_text = error;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Order Creation Option
		getOrderCreationOption() {
			this.order_creation_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/order_creation_option?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.order_creation_option = response.data;
				this.order_creation_loading = false;
			}, (error) => {
				console.log(error);
				this.order_creation_loading = false;
			});
		},

		// Order Fuflillment Option
		getFulfillmentCreationOption() {
			this.fulfillment_creation_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/fulfillment_creation_option?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.fulfillment_creation_option = response.data;
				this.fulfillment_creation_loading = false;
			}, (error) => {
				console.log(error);
				this.fulfillment_creation_loading = false;
			});
		},

		// Order Cancellation Option
		getOrderCancellationOption() {
			this.order_cancellation_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/order_cancellation_option?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.order_cancellation_option = response.data;
				this.order_cancellation_loading = false;
			}, (error) => {
				console.log(error);
				this.order_cancellation_loading = false;
			});
		},

		// pos Integration Data
		getPOSIntegration() {
			this.pos_integration_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/integrations?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.pos_list = response.data.pos_integration;
				this.pos_integration_loading = false;
				console.log(this.pos_list)
			}, (error) => {
				console.log(error);
				this.pos_list = [];
				this.pos_integration_loading = false;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		//Get Shop Locations
		getShopLocations() {
			this.inventory_loading = true;
			this.$Axios.get(this.$backendURL + "/locations?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.locations = response.data.locations;
				this.inventory_loading = false;
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.inventory_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Save & Update pos/Account
		savepos() {
			this.pos_integration_loading = true;
			if (this.pos_integration.id == null) {
				this.$Axios.post(this.$backendURL + "/erp_integration/integrations?shop=" + this.$shop, {
					shop: this.$shop,
					integration_name: this.pos_integration.integration_name,
					unique_identifier: this.pos_integration.unique_identifier,
					enable_inv_sync: this.pos_integration.enable_inv_sync,
					schedule_inv_sync: this.pos_integration.schedule_inv_sync,
					enable_order_posting: this.pos_integration.enable_order_posting,
					enable_price_sync: this.pos_integration.enable_price_sync,
					schedule_price_sync: this.pos_integration.schedule_price_sync,
					api_endpoint: this.pos_integration.api_endpoint,
					api_key: this.pos_integration.api_key,
					shopify_api_key: this.pos_integration.shopify_api_key,
					shopify_api_password: this.pos_integration.shopify_api_password,
					shopify_api_access_token: this.pos_integration.shopify_api_access_token,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.pos_integration_loading = false;
					this.snackbar = true;
					this.snackbar_text = "Account Saved";
					this.close()
					this.getPOSIntegration()
				}, (error) => {
					console.log(error);
					this.pos_integration_loading = false;
					this.snackbar = true;
					this.snackbar_text = error;
				});
			} else {
				this.$Axios.put(this.$backendURL + "/erp_integration/integrations?shop=" + this.$shop + "&id=" + this.pos_integration.id, {
					id: this.pos_integration.id,
					shop: this.$shop,
					integration_name: this.pos_integration.integration_name,
					unique_identifier: this.pos_integration.unique_identifier,
					enable_inv_sync: this.pos_integration.enable_inv_sync,
					schedule_inv_sync: this.pos_integration.schedule_inv_sync,
					enable_order_posting: this.pos_integration.enable_order_posting,
					enable_price_sync: this.pos_integration.enable_price_sync,
					schedule_price_sync: this.pos_integration.schedule_price_sync,
					api_endpoint: this.pos_integration.api_endpoint,
					api_key: this.pos_integration.api_key,
					shopify_api_key: this.pos_integration.shopify_api_key,
					shopify_api_password: this.pos_integration.shopify_api_password,
					shopify_api_access_token: this.pos_integration.shopify_api_access_token,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.snackbar = true;
					this.pos_integration_loading = false;
					this.snackbar_text = "Account Saved";
					this.close()
					this.getPOSIntegration()
				}, (error) => {
					console.log(error);
					this.snackbar = true;
					this.pos_integration_loading = false;
					this.snackbar_text = error;
				});
			}
		},

		// Order Creation Option Posting
		saveOrderCreationOption() {
			this.order_creation_loading = true;
			if (this.order_creation_option.id == null) {
				this.$Axios.post(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					shop: this.$shop,
					shopify_tag: this.order_creation_option.shopify_tag,
					append_tag: this.order_creation_option.append_tag,
					order_creation: this.order_creation_option.order_creation,
					event_trigger: this.order_creation_option.event_trigger,
					fulfillment_creation: false,
					order_cancellation: false,
					trigger_type: "order_creation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.order_creation_option = response.data;
					this.snackbar = true;
					this.order_creation_loading = false;
					this.snackbar_text = "Order Creation Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.order_creation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			} else {
				this.$Axios.put(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					id: this.order_creation_option.id,
					shopify_tag: this.order_creation_option.shopify_tag,
					append_tag: this.order_creation_option.append_tag,
					event_trigger: this.order_creation_option.event_trigger,
					order_creation: this.order_creation_option.order_creation,
					fulfillment_creation: false,
					order_cancellation: false,
					trigger_type: "order_creation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.order_creation_option = response.data;
					this.snackbar = true;
					this.order_creation_loading = false;
					this.snackbar_text = "Order Creation Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.order_creation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			}
		},

		// Order Fuflillment Option Posting
		saveOrderFulfilmentOption() {
			this.fulfillment_creation_loading = true;
			if (this.fulfillment_creation_option.id == null) {
				this.$Axios.post(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					shop: this.$shop,
					shopify_tag: this.fulfillment_creation_option.shopify_tag,
					append_tag: this.fulfillment_creation_option.append_tag,
					order_creation: false,
					event_trigger: '',
					fulfillment_creation: this.fulfillment_creation_option.fulfillment_creation,
					order_cancellation: false,
					trigger_type: "fulfillment_creation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.fulfillment_creation_option = response.data;
					this.snackbar = true;
					this.fulfillment_creation_loading = false;
					this.snackbar_text = "Order Fulfillment Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.fulfillment_creation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			} else {
				this.$Axios.put(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					id: this.fulfillment_creation_option.id,
					shopify_tag: this.fulfillment_creation_option.shopify_tag,
					append_tag: this.fulfillment_creation_option.append_tag,
					order_creation: false,
					event_trigger: '',
					fulfillment_creation: this.fulfillment_creation_option.fulfillment_creation,
					order_cancellation: false,
					trigger_type: "fulfillment_creation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.fulfillment_creation_option = response.data;
					this.snackbar = true;
					this.fulfillment_creation_loading = false;
					this.snackbar_text = "Order Fulfillment Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.fulfillment_creation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			}
		},

		// Order Cancellation Option Posting
		saveOrderCancellationOption() {
			this.order_cancellation_loading = true;
			if (this.order_cancellation_option.id == null) {
				this.$Axios.post(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					shop: this.$shop,
					shopify_tag: this.order_cancellation_option.shopify_tag,
					append_tag: this.order_cancellation_option.append_tag,
					order_creation: false,
					fulfillment_creation: false,
					event_trigger: '',
					order_cancellation: this.order_cancellation_option.order_cancellation,
					trigger_type: "order_cancellation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.order_cancellation_option = response.data;
					this.snackbar = true;
					this.order_cancellation_loading = false;
					this.snackbar_text = "Order Creation Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.order_cancellation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			} else {
				this.$Axios.put(this.$backendURL + "/erp_integration/triggers?shop=" + this.$shop, {
					id: this.order_cancellation_option.id,
					shopify_tag: this.order_cancellation_option.shopify_tag,
					append_tag: this.order_cancellation_option.append_tag,
					order_creation: false,
					fulfillment_creation: false,
					event_trigger: '',
					order_cancellation: this.order_cancellation_option.order_cancellation,
					trigger_type: "order_cancellation"
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					this.order_cancellation_option = response.data;
					this.snackbar = true;
					this.order_cancellation_loading = false;
					this.snackbar_text = "Order Creation Option Saved";
				}, (error) => {
					console.log(error);
					this.snackbar_text = error;
					this.order_cancellation_loading = false;
					if (error.response.data.detail == "Session expired, Reopen the application!") {
						this.$router.push('/error')
					}
				});
			}
		},

		// Get Inventory Sync Settings
		getInventorySettings() {
			this.inventory_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/inventory_sync?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				let temp = response.data
				temp = {
					...temp,
					last_sync: new Date(temp.last_sync)
				}
				this.inventory_settings = temp;
				this.inventory_loading = false;
			}, (error) => {
				console.log(error);
				this.inventory_settings = {};
				// this.snackbar = true;
				this.inventory_loading = false;
				// this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Update or create Inventory Sync Settings
		saveInventorySettings() {
			this.inventory_loading = true;
			this.$Axios.post(this.$backendURL + "/erp_integration/inventory_sync", {
				shop: this.$shop,
				use_hold_qty: this.inventory_settings.use_hold_qty,
				schedule_sync: this.inventory_settings.schedule_sync,
				schedule_day: this.inventory_settings.schedule_day,
				schedule_time: this.inventory_settings.schedule_time,
				location_id: this.inventory_settings.location_id,
				restrict_tag: this.inventory_settings.restrict_tag
			}, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.inventory_loading = false;
				this.snackbar_text = response.data.detail;
			}, (error) => {
				console.log(error);
				this.snackbar_text = error;
				this.inventory_loading = false;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

    // Sync Inventory Now
		syncInventoryNow() {
			this.inventory_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/sync_now?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.inventory_loading = false;
				this.snackbar_text = response.data.detail;
				this.inventory_settings = {
					...this.inventory_settings,
					last_sync: new Date(response.data.last_sync)
				}
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.inventory_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

    // Inventory Sync
		inventorySync(item) {
			this.delete_pos_integration = Object.assign({}, item)
			this.pos_integration_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/sync_single_integration?shop=" + this.$shop + "&id=" + this.delete_pos_integration.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = response.data.detail;
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Price Sync
		priceSync(item) {
			this.delete_pos_integration = Object.assign({}, item)
			this.pos_integration_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/price_sync_single_integration?shop=" + this.$shop + "&id=" + this.delete_pos_integration.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = response.data.detail;
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Combine Sync (Inventory and Price)
		combineSync(item) {
			this.delete_pos_integration = Object.assign({}, item)
			this.pos_integration_loading = true;
			this.$Axios.get(this.$backendURL + "/erp_integration/combine_sync_single_integration?shop=" + this.$shop + "&id=" + this.delete_pos_integration.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = response.data.detail;
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.pos_integration_loading = false;
				this.snackbar_text = error.response.data.detail;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

    // Close Panel
		closePanel(index) {
			this.openedPanel.splice(index, 1)
		},


		downloadSampleSKUfile(sale_type) {
      this.$Axios.get(this.$backendURL + "/product_operations/download_sample?sample=sku&sale_type=" + sale_type, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        let csv_data = response.data

        console.log(csv_data)
        var fileURL = window.URL.createObjectURL(new Blob([csv_data]));
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'sale.csv');
        document.body.appendChild(fileLink);

        fileLink.click();

        this.snackbar_text = "File Downloaded successfully"
        this.snackbar = true
      }, (error) => {
        console.log(error);
        this.snackbar_text = "Something went wrong. Please Try Again Later"
        this.snackbar = true

      });
    },

    downloadSampleBarcodeFile(sale_type) {
      this.$Axios.get(this.$backendURL + "/product_operations/download_sample?sample=barcode&sale_type=" + sale_type, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        let csv_data = response.data

        console.log(csv_data)
        var fileURL = window.URL.createObjectURL(new Blob([csv_data]));
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'sale.csv');
        document.body.appendChild(fileLink);

        fileLink.click();

        this.snackbar_text = "File Downloaded successfully"
        this.snackbar = true
      }, (error) => {
        console.log(error);
        this.snackbar_text = "Something went wrong. Please Try Again Later"
        this.snackbar = true

      });
    },

		fileUploadWithSaleProcess(sale_process) {
      let formData = new FormData();
			debugger;
      formData.append('csv_file', this.file)
      this.sale_loading = true;
      this.$Axios.post(this.$backendURL + "/product_operations/file_upload_with_sale_process?shop=" + this.$shop + "&sale_process=" + sale_process + "&sale_tag=" + this.sale_tag + "&sale_type=" + this.sale_type, formData, {
				headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.sale_loading = false
        this.snackbar_text = response.data.message
        this.snackbar = true
      }, (error) => {
        console.log(error);
        this.sale_loading = false
        this.snackbar_text = error.response.data.message
        this.snackbar = true
      });
    },

	}
}