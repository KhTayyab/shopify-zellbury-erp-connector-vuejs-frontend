// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar';

export default {
  name: 'Orders',
  components: {
    Navbar
  },
  data () {
    return {
      plan_upgrade_required: false,
      phone_number_loading: false,
      update_phone_content: {},
      payment_filter: null,
      fulfillment_filter: null,
      limit_filter: 50,
      showFilters: false,
      searchDebounce: null,
      loading_data: 'black',
      orders: [],
      next_page_url: '',
      previous_page_url: '',
      remaining_orders: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      perPageOptions: [5, 10, 50, 100, 150, 200, 250],
      selected: [],
      phone_dialog: false,
      snackbar: false,
      snackbar_text: '',
      snackbar_timeout: 2000,
      columns: [
        { text: 'Order', value: 'id', show: true },
        { text: 'Customer name', value: 'customer', show: true },
        { text: 'Phone', value: 'phone', show: true },
        { text: 'Status', value: 'status', show: true },
        { text: 'Tag', value: 'tags', show: true },
        { text: 'Consignment', value: 'cn', show: true },
        { text: 'City', value: 'city', show: true },
        { text: 'Payment', value: 'payment_status', show: true },
        { text: 'Amount', value: 'amount', show: true },
        { text: '', value: 'actions', sortable: false, width: '68px', show: true }
      ],
      headers: [
        { text: 'Order', value: 'id' },
        { text: 'Customer name', value: 'customer' },
        { text: 'Phone', value: 'phone' },
        { text: 'Status', value: 'status' },
        { text: 'Tag', value: 'tags' },
        { text: 'Consignment', value: 'cn' },
        { text: 'City', value: 'city' },
        { text: 'Payment', value: 'payment_status' },
        { text: 'Amount', value: 'amount' },
        { text: '', value: 'actions', sortable: false, width: '68px' }
      ],
      payment_status_list: [
        {
          name: 'any',
          title: 'Any'
        },
        {
          name: 'pending',
          title: 'Pending'
        },
        {
          name: 'authorized',
          title: 'Authorized'
        },
        {
          name: 'partially_paid',
          title: 'Partially'
        },
        {
          name: 'paid',
          title: 'Paid'
        },
        {
          name: 'partially_refunded',
          title: 'Partially'
        },
        {
          name: 'refunded',
          title: 'Refunded'
        },
        {
          name: 'voided',
          title: 'Voided'
        },
      ],
      fulfillment_filter_list: [
        {
          name: 'any',
          title: 'Any'
        },
        {
          name: 'shipped',
          title: 'Fulfilled'
        },
        {
          name: 'unfulfilled',
          title: 'Unfulfilled'
        },
        {
          name: 'partial',
          title: 'Partially'
        },
      ]
    }
  },
  created() {
    this.initialize()
  },
  mounted() {
  },
  watch: {
    phone_dialog (val) {
      val || this.closeMessageDialog()
    }
  },
  methods: {
    
    // Initialize Funcation
    initialize() {
      this.getorders()
    },
    
    // Get Orders
    getorders() {
      this.payment_filter = null
      this.fulfillment_filter = null
      this.loading_data = 'black';
      this.$Axios.get(this.$backendURL + "/orders?shop=" + this.$shop + "&limit=" + this.limit_filter + "&financial_status=" + this.payment_filter + "&fulfillment_status=" + this.fulfillment_filter + "&region_filter=null", {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.orders = response.data.orders;
        this.plan_upgrade_required = response.data.plan_upgrade_required;
        this.loading_data = false;
        this.next_page_url = response.data.next_page_url;
        this.previous_page_url = response.data.previous_page_url;
        this.remaining_orders = response.data.remaining_order
      }, (error) => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },
    
    // Get Next Page Orders
    getNextPageOrders() {
      if (this.next_page_url !== false) {
        this.loading_data = 'black';
        this.$Axios.get(this.$backendURL + "/orders?shop=" + this.$shop + "&page_info=" + this.next_page_url[1] + "&page_url=" + this.next_page_url[0] + "&limit=" + this.limit_filter + "&financial_status=" + this.payment_filter + "&fulfillment_status=" + this.fulfillment_filter + "&region_filter=null", {
          headers: {
            'Authorization': this.$API_TOKEN.replace('%20', ' ')
          }
        }).then((response) => {
          console.log(response);
          this.orders = response.data.orders
          this.loading_data = false;
          this.next_page_url = response.data.next_page_url;
          this.previous_page_url = response.data.previous_page_url;
          this.remaining_orders = response.data.remaining_order
        }, (error) => {
          if (error.response.data.detail == "Session expired, Reopen the application!") {
            this.$router.push('/error')
          }
        });
      } else {
        console.log("You have reached last page");
      }
    },
    
    // Get Previous Page Orders
    getPreviousPageOrders() {
      if (this.previous_page_url !== false) {
        this.loading_data = 'black';
        this.$Axios.get(this.$backendURL + "/orders?shop=" + this.$shop + "&page_info=" + this.previous_page_url[1] + "&page_url=" + this.previous_page_url[0] + "&limit=" + this.limit_filter + "&financial_status=" + this.payment_filter + "&fulfillment_status=" + this.fulfillment_filter + "&region_filter=null", {
          headers: {
            'Authorization': this.$API_TOKEN.replace('%20', ' ')
          }
        }).then((response) => {
          console.log(response);
          this.orders = response.data.orders
          this.loading_data = false;
          this.next_page_url = response.data.next_page_url;
          this.previous_page_url = response.data.previous_page_url;
          this.remaining_orders = response.data.remaining_order
        }, (error) => {
          if (error.response.data.detail == "Session expired, Reopen the application!") {
            this.$router.push('/error')
          }
        });
        
      } else {
        console.log("You have reached first page");
      }
    },
    
    // Filter Handling
    handleFilterAdd(selected_filter, filter_type) {
			// eslint-disable-next-line
      // debugger;
      if (filter_type == 'payment_filter') {
        this.payment_filter = selected_filter
      }
      if (filter_type == 'fulfillment_filter') {
        this.fulfillment_filter = selected_filter
      }
      if (filter_type == 'limit_filter') {
        this.limit_filter = selected_filter;
        this.itemsPerPage = selected_filter;
      }
      
      this.loading_data = 'black';
      // eslint-disable-next-line
      // debugger;
      this.$Axios.get(this.$backendURL + "/orders?shop=" + this.$shop + "&limit=" + this.limit_filter + "&financial_status=" + this.payment_filter + "&fulfillment_status=" + this.fulfillment_filter + "&region_filter=null", {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.orders = response.data.orders;
        this.plan_upgrade_required = response.data.plan_upgrade_required;
        this.loading_data = false;
        this.next_page_url = response.data.next_page_url;
        this.previous_page_url = response.data.previous_page_url;
        this.remaining_orders = response.data.remaining_order
      }, (error) => {
        console.log(error);
      });
    },
    
    // Search Order
		searchOrder(search_value) {
			this.payment_filter = null
			this.fulfillment_filter = null
			this.loading_data = 'black';
			this.$Axios.post(this.$backendURL + "/search_orders?shop=" + this.$shop + "&limit=" + this.limit_filter + "&financial_status=" + this.payment_filter + "&fulfillment_status=" + this.fulfillment_filter + "&region_filter=null", {
					search_value: search_value
				},{
				headers: {
					'Authorization': this.$API_TOKEN.replace('%20', ' ')
				}
			}).then((response) => {
				this.orders = response.data.orders;
        this.plan_upgrade_required = response.data.plan_upgrade_required;
				this.loading_data = false;
				this.next_page_url = response.data.next_page_url;
				this.previous_page_url = response.data.previous_page_url;
				this.remaining_orders = response.data.remaining_order
			}, (error) => {
				if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
			});
    },
    
    // Color Funcation
    getColor (status) {
      if (status == "fulfilled") return 'green'
      else return 'orange'
    },
    
    // Search Function
    search (e) {
      var context = this;
      clearTimeout(context.searchDebounce);
      context.searchDebounce = setTimeout(() => {
				console.log(e);
				this.searchOrder(e)
      }, 1000);
    },
    
    // Hander Change
    headerChange (checked, title) {
      var context = this;
      if(checked) {
        context.columns.forEach(function(column) {
          if(column.text === title) {
            context.headers.splice(context.headers.length-1, 0, column);
          }
        });
      } else {
        context.headers.forEach(function(header, index) {
          if(header.text === title) {
            context.headers.splice(index, 1);
          }
        });
      }
    },
    
    // Close Phone Dialog Dialog
    closePhoneDialog () {
      this.phone_dialog = false
    },
    
    // Order Phone Dialog
    editPhoneDialog(item) {
      this.update_phone_content = Object.assign({}, item)
      this.update_phone_content.phone = item.phone
      this.update_phone_content.order_id = item.id
      this.phone_dialog = true
    },
    
    // Order Phone Updated
    updateOrderPhone() {
      this.phone_number_loading = true;
      this.$Axios.post(this.$backendURL + "/update_order_phone?shop=" + this.$shop, {
          shop: this.$shop,
          phone: this.update_phone_content.phone,
          orderId:this.update_phone_content.shopify_id
        },{
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.closePhoneDialog()
        this.snackbar = true;
        this.phone_number_loading = false;
        this.snackbar_text = response.data.detail;
        this.getorders()
      }, (error) => {
        console.log(error);
        this.snackbar = true;
        this.snackbar_text = error;
        this.phone_number_loading = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },

    // Update to new Billing Pattern
    upgradePlan(planName, plan_downgrade_status) {
      window.open(this.$backendURL + "/create-subscription?shop=" + this.$shop + "&plan_name=" + planName + "&downgrade_status=" + plan_downgrade_status, "_self")
    }
  }
}
