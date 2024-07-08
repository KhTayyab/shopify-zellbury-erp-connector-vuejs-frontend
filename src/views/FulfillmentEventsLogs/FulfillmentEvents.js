// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar';
import moment from 'moment'
import { format, parseISO } from 'date-fns'

export default {
  name: 'Logs',
  components: {
    Navbar
  },
  data () {
    return {
      search: '',
      courier: '',
      status: '',
      fulfillment_order_id: '',
      order_id: '',
      event_status: '',
      shopify_paid_status: '',
      gtech_paid_status: '',
      message: '',
      showFilters: false,
      loading_data: 'black',
      logs: [],
      itemsPerPage: 10,
      selected: [],
      columns: [
        { text: 'Courier', value: 'courier', show: true},
        { text: 'Status', value: 'status', show: true},
        { text: 'Fulfillment ID', value: 'fulfillment_order_id', show: true},
        { text: 'Order ID', value: 'order_id', show: true},
        { text: 'Fulfillment event status', value: 'event_status', show: true},
        { text: 'Shopify Paid Status', value: 'shopify_paid_status', show: true},
        { text: 'Gtech Paid Status', value: 'gtech_paid_status', show: true},
        { text: 'Message', value: 'message', show: true},
        { text: 'Updated', value: 'updated_at', show: true, dataType: "Date"},
        { text: 'Actions', value: 'actions', sortable: false, width: '250px'},
      ],
      headers: [
        { text: 'Courier', value: 'courier', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'courier' ].toLowerCase() ) }},
        { text: 'Status', value: 'status', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'status' ].toLowerCase() ) }},
        { text: 'Fulfillment ID', value: 'fulfillment_order_id', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'fulfillment_order_id' ].toLowerCase() ) }},
        { text: 'Order ID', value: 'order_id', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'order_id' ].toLowerCase() ) }},
        { text: 'Fulfillment event status', value: 'event_status', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'event_status' ].toLowerCase() ) }},
        { text: 'Shopify Paid Status', value: 'shopify_paid_status', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'shopify_paid_status' ].toLowerCase() ) }},
        { text: 'Gtech Paid Status', value: 'gtech_paid_status', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'gtech_paid_status' ].toLowerCase() ) }},
        { text: 'Message', value: 'message', show: true, filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'message' ].toLowerCase() ) }},
        { text: 'Updated', value: 'updated_at'},
        { text: 'Actions', value: 'actions',sortable: false, width: '250px'},
      ],
      menu1: false,
      menu2: false,
      start_date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      end_date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      snackbar: false,
			snackbarColor: "success",
			snackbar_text: "",
      snackbar_timeout: 2000,
    }
  },

  computed: {
    startDateFormat () {
      return this.start_date ? moment(this.start_date).format('dddd, MMMM Do YYYY') : ''
    },
    endDateFormat () {
      return this.end_date ? moment(this.end_date).format('dddd, MMMM Do YYYY') : ''
    },
  },

  created() {
    this.initialize()
  },
  
  mounted() {
  },
  
  methods: {

    // Initialize Funcation
    initialize() {
      this.getlogs()
    },
    
    // Get Logs
    getlogs() {
      this.loading_data = 'black';
      this.$Axios.get(this.$backendURL + "/fulfillment_events/fulfillment_events_logs?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.logs = response.data.logs;
        this.loading_data = false;
      }, (error) => {
        this.logs = [];
        this.loading_data = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },
	// Compare at Price Sync
	retry_event(item) {
		// this.obj = Object.assign({}, item)
		debugger
		this.loading_data = "black";
		this.$Axios.post(this.$backendURL + "/fulfillment_events/retry", {
			id : item.id,
			shop: this.$shop,
		}, {
			headers: {
				'Authorization': this.$API_TOKEN.replace('%20', ' ')
			}
		}).then((response) => {
			this.snackbar = true;
			this.getlogs()
			this.loading_data = false;
			console.log(response)
			this.snackbar_text = "Request sent";
		}, (error) => {
			console.log(error);
			this.snackbar = true;
			this.loading_data = false;
			this.snackbar_text = error.response.data.detail;
			if (error.response.data.detail == "Session expired, Reopen the application!") {
				this.$router.push('/error')
			}
		});
	},


    // Seach Funcation
    search (e) {
      var context = this;
      clearTimeout(context.searchDebounce);
      context.searchDebounce = setTimeout(() => {
        console.log(e);
      }, 1000);
    },

    // Header Change
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
    
    // Download Logs
    downloadLogs() {
      window.open(this.$backendURL + "/fulfillment_events/download_fulfillment_events_logs?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date)
    }
  }
}
