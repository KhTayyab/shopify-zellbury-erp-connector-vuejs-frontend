import Navbar from '@/components/Navbar';
export default {
	name: 'FulfillmentEvents',
	components: {
		Navbar
	},
	data() {
		return {
			webhook: 'https://zellbury-backend.alche.cloud/fulfillment_events/event_webhook',
			three_pl_list: [],
			three_pl_names_list: [],
			three_pl: {},
			delete_three_pl: {},
			delete_dialog: false,
			dialog: false,
			three_pl_loading: false,

			// Exclusion list
			exclusion_dialog: false,
			exclusion_list: [],
			exclusion_event: {},
			delete_exclusion: {},
			delete_exclusion_dialog: false,
			exclusion_loading: false,


			mapping_dialog: false,
			mapping_list: [],
			mapping_event: {},
			delete_mapping: {},
			delete_mapping_dialog: false,
			mapping_loading: false,


			snackbar: false,
			snackbar_text: '',
			snackbar_timeout: 2000,

			headers: [{
					text: '3PL Name',
					align: 'start',
					sortable: false,
					value: 'name_3pl'
				}, {
					text: 'Status Path',
					value: 'status_path_3pl'
				}, {
					text: 'Fulfillment ID Path',
					value: 'order_fulfillment_id_path'
				}, {
					text: 'Actions',
					value: 'actions',
					sortable: false,
					width: '250px'
				},
			],
			headers_exclusion: [{
				text: '3PL',
				align: 'start',
				sortable: false,
				value: 'name_3pl'
			},{
				text: 'Event Name',	
				value: 'event_name'
			},{
				text: 'Actions',
				value: 'actions',
				sortable: false,
				width: '250px'
			},
		],
		headers_mapping: [{
			text: '3PL',
			align: 'start',
			sortable: false,
			value: 'name_3pl'
		}, {
			text: '3PL Event',
			value: 'three_pl_event'
		},{
			text: 'Shopify Event',
			value: 'shopify_event'
		},{
			text: 'Actions',
			value: 'actions',
			sortable: false,
			width: '250px'
		},
	],
			editedIndex: -1,
			exclusion_editedIndex: -1,
			mapping_editedIndex: -1,
			shopify_fulfillment_events: ['ready_for_pickup', 'picked_up', 'out_for_delivery', 'label_purchased', 'label_printed', 'in_transit', 'failure', 'delivered', 'delayed', 'confirmed', 'carrier_picked_up', 'attempted_delivery'],
			defaultItem: {}
		}
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New 3PL Account' : 'Edit 3PL Account'
		},
		formTitleExclusion() {
			return this.exclusion_editedIndex === -1 ? 'New Event' : 'Edit Event'
		},
		formTitleMapping() {
			return this.mapping_editedIndex === -1 ? 'New Mapping of Event' : 'Edit Mapping of Event'
		},
		webhook_url(){
			if (this.three_pl && this.three_pl.name_3pl !== undefined) {
				return this.webhook + "/" + this.three_pl.name_3pl;
			} else {
				return this.webhook;
			}
		}
	},
	watch: {
		dialog(val) {
			val || this.close()
		},
		exclusion_dialog(val) {
			val || this.close_exclusion_dialog()
		},
		mapping_dialog(val) {
			val || this.close_mapping_dialog()
		},
	},
	created() {
		this.initialize()
	},
	methods: {
		initialize() {
			this.getThreePL()
			
		},
		
		// Edit Dialog
		editItem(item) {
			this.editedIndex = this.three_pl_list.indexOf(item)
			this.three_pl = Object.assign({}, item)
			this.dialog = true
		},
		editItemExclusion(item) {
			this.exclusion_editedIndex = this.exclusion_list.indexOf(item)
			this.exclusion_event = Object.assign({}, item)
			this.exclusion_dialog = true
		},
		editItemMapping(item) {
			this.mapping_editedIndex = this.mapping_list.indexOf(item)
			this.mapping_event = Object.assign({}, item)
			this.mapping_dialog = true
		},

		// Delete Dialog
		deleteItem(item) {
			this.delete_three_pl = Object.assign({}, item)
			this.delete_dialog = true
		},
		deleteItemExclusion(item) {
			this.delete_exclusion = Object.assign({}, item)
			this.delete_exclusion_dialog = true
		},
		deleteItemMapping(item) {
			this.delete_mapping = Object.assign({}, item)
			this.delete_mapping_dialog = true
		},

		// Close Dialogs
		close() {
			this.dialog = false
			this.$nextTick(() => {
				this.three_pl = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		close_exclusion_dialog() {
			this.exclusion_dialog = false
			this.$nextTick(() => {
				this.exclusion_event = Object.assign({}, this.defaultItem)
				this.exclusion_editedIndex = -1
			})
		},
		close_mapping_dialog() {
			this.mapping_dialog = false
			this.$nextTick(() => {
				this.mapping_event = Object.assign({}, this.defaultItem)
				this.mapping_editedIndex = -1
			})
		},

		// Close Delete Dialog
		closeDeleteDialog() {
			this.delete_dialog = false
		},
		closeDeleteDialogExclusion() {
			this.delete_exclusion_dialog = false
		},
		closeDeleteDialogMapping() {
			this.delete_mapping_dialog = false
		},


		delete3PL() {
			this.order_cancellation_loading = true;
			this.$Axios.delete(this.$backendURL + "/fulfillment_events/3pl?id=" + this.delete_three_pl.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				console.log(response);
				this.snackbar = true;
				this.order_cancellation_loading = false;
				this.snackbar_text = "3PL Acoount Deleted";
				this.closeDeleteDialog()
				this.getThreePL()
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

		deleteExclusion() {
			this.exclusion_loading = true;
			this.$Axios.delete(this.$backendURL + "/fulfillment_events/exclusion_events?id=" + this.delete_exclusion.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				console.log(response);
				this.snackbar = true;
				this.exclusion_loading = false;
				this.snackbar_text = "Event Deleted";
				this.closeDeleteDialogExclusion()
				this.getExclusion()
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.exclusion_loading = false;
				this.snackbar_text = error;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},
		deleteMapping() {
			this.mapping_loading = true;
			this.$Axios.delete(this.$backendURL + "/fulfillment_events/mapping_events?id=" + this.delete_mapping.id, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				console.log(response);
				this.snackbar = true;
				this.mapping_loading = false;
				this.snackbar_text = "Event Deleted";
				this.closeDeleteDialogMapping()
				this.getMapping()
			}, (error) => {
				console.log(error);
				this.snackbar = true;
				this.mapping_loading = false;
				this.snackbar_text = error;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		getThreePL() {
			this.three_pl_loading = "black";
			this.$Axios.get(this.$backendURL + "/fulfillment_events/3pl?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.three_pl_list = response.data.three_pl;
				this.three_pl_names_list = response.data.three_pl.map(item => item.name_3pl);
				this.getExclusion();
				this.getMapping();
				this.three_pl_loading = false;
			}, (error) => {
				console.log(error);
				this.three_pl_list = [];
				this.three_pl_loading = false;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},
		getExclusion() {
			this.exclusion_loading = "black";
			this.$Axios.get(this.$backendURL + "/fulfillment_events/exclusion_events?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.exclusion_list = response.data.events_exclusion;
				this.exclusion_loading = false;
			}, (error) => {
				console.log(error);
				this.exclusion_list = [];
				this.exclusion_loading = false;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},
		getMapping() {
			this.mapping_loading = "black";
			this.$Axios.get(this.$backendURL + "/fulfillment_events/mapping_events?shop=" + this.$shop, {
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.mapping_list = response.data.events_mapping;
				this.mapping_loading = false;
			}, (error) => {
				console.log(error);
				this.mapping_list = [];
				this.mapping_loading = false;
				if (error.response.data.detail == "Session expired, Reopen the application!") {
					this.$router.push('/error')
				}
			});
		},

		// Save & Update
		save3pl() {
			this.three_pl_loading = "black";
			if (this.three_pl.id == null) {
				this.$Axios.post(this.$backendURL + "/fulfillment_events/3pl?shop=" + this.$shop, {
					shop: this.$shop,
					// shopify_event: this.three_pl.shopify_event,
					name_3pl: this.three_pl.name_3pl,
					// tracking_path_3pl: this.three_pl.tracking_path_3pl,
					status_path_3pl: this.three_pl.status_path_3pl,
					order_fulfillment_id_path: this.three_pl.order_fulfillment_id_path,
					
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.three_pl_loading = false;
					this.snackbar = true;
					this.snackbar_text = "Account Saved";
					this.close()
					this.getThreePL()
				}, (error) => {
					console.log(error);
					this.three_pl_loading = false;
					this.snackbar = true;
					this.snackbar_text = error.response.data.detail;
				});
			} else {
				this.$Axios.put(this.$backendURL + "/fulfillment_events/3pl?shop=" + this.$shop + "&id=" + this.three_pl.id, {
					id: this.three_pl.id,
					shop: this.$shop,
					// shopify_event: this.three_pl.shopify_event,
					name_3pl: this.three_pl.name_3pl,
					// tracking_path_3pl: this.three_pl.tracking_path_3pl,
					status_path_3pl: this.three_pl.status_path_3pl,
					order_fulfillment_id_path: this.three_pl.order_fulfillment_id_path,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.snackbar = true;
					this.three_pl_loading = false;
					this.snackbar_text = "Account Saved";
					this.close()
					this.getThreePL()
				}, (error) => {
					console.log(error);
					this.snackbar = true;
					this.three_pl_loading = false;
					this.snackbar_text = error;
				});
			}
		},
		saveExclusionEvents() {
			this.exclusion_loading = "black";
			if (this.exclusion_event.id == null) {
				this.$Axios.post(this.$backendURL + "/fulfillment_events/exclusion_events?shop=" + this.$shop, {
					shop: this.$shop,
					event_name: this.exclusion_event.event_name,
					three_pl: this.exclusion_event.three_pl,
					
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.exclusion_loading = false;
					this.snackbar = true;
					this.snackbar_text = "Account Saved";
					this.close_exclusion_dialog()
					this.getExclusion()
				}, (error) => {
					console.log(error);
					this.exclusion_loading = false;
					this.snackbar = true;
					this.snackbar_text = error;
				});
			} else {
				this.$Axios.put(this.$backendURL + "/fulfillment_events/exclusion_events?shop=" + this.$shop + "&id=" + this.exclusion_event.id, {
					id: this.exclusion_event.id,
					shop: this.$shop,
					event_name: this.exclusion_event.event_name,
					three_pl: this.exclusion_event.three_pl,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.snackbar = true;
					this.exclusion_loading = false;
					this.snackbar_text = "Account Saved";
					this.close_exclusion_dialog()
					this.getExclusion()
				}, (error) => {
					console.log(error);
					this.snackbar = true;
					this.exclusion_loading = false;
					this.snackbar_text = error;
				});
			}
		},
		saveMappingEvents() {
			this.mapping_loading = "black";
			if (this.mapping_event.id == null) {
				this.$Axios.post(this.$backendURL + "/fulfillment_events/mapping_events?shop=" + this.$shop, {
					shop: this.$shop,
					three_pl: this.mapping_event.three_pl,
					three_pl_event: this.mapping_event.three_pl_event,
					shopify_event: this.mapping_event.shopify_event,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.mapping_loading = false;
					this.snackbar = true;
					this.snackbar_text = "Account Saved";
					this.close_mapping_dialog()
					this.getMapping()
				}, (error) => {
					console.log(error);
					this.mapping_loading = false;
					this.snackbar = true;
					this.snackbar_text = error;
				});
			} else {
				this.$Axios.put(this.$backendURL + "/fulfillment_events/mapping_events?shop=" + this.$shop + "&id=" + this.mapping_event.id, {
					id: this.mapping_event.id,
					shop: this.$shop,
					three_pl: this.mapping_event.three_pl,
					three_pl_event: this.mapping_event.three_pl_event,
					shopify_event: this.mapping_event.shopify_event,
				}, {
					headers: {
						'Authorization': this.$API_TOKEN.replace('%20', ' ')
					}
				}).then((response) => {
					console.log(response);
					this.snackbar = true;
					this.mapping_loading = false;
					this.snackbar_text = "Account Saved";
					this.close_mapping_dialog()
					this.getMapping()
				}, (error) => {
					console.log(error);
					this.snackbar = true;
					this.mapping_loading = false;
					this.snackbar_text = error;
				});
			}
		},
	}
}