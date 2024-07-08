// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar';
import moment from 'moment'
import { format, parseISO } from 'date-fns'

export default {
  name: 'OrderQueues',
  components: {
    Navbar
  },
  data () {
    return {
      order_queue_loading: false,
      order_queue: {
        webhook: '',
				order_id: '',
      },
      queue_list: ['creation', 'cancellation'],
      order_queue_dialog: false,
      search: '',
      order_id: '',
      status: '',
      web_hook: '',
      status_message: '',
      provider_filter: null,
      showFilters: false,
      loading_data: 'black',
      order_logs: [],
      itemsPerPage: 10,
      selected: [],
      columns: [
        { text: 'Order ID', value: 'order_id', show: true },
        { text: 'Status', value: 'status', show: true },
        { text: 'Web Hook', value: 'web_hook', show: true },
        { text: 'Response', value: 'status_message', show: true },
        { text: 'Datetime', value: 'created_at', show: true, dataType: "Date"},
        { text: '', value: 'actions', sortable: false, width: '68px', show: true }
      ],
      headers: [
        { text: 'Order ID', value: 'order_id', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'order_id' ].toLowerCase() ) }},
        { text: 'Status', value: 'status', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'status' ].toLowerCase() ) }},
        { text: 'Web Wook', value: 'web_hook', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'web_hook' ].toLowerCase() ) }},
        { text: 'Response', value: 'status_message', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'status_message' ].toLowerCase() ) }},
        { text: 'Datetime', value: 'created_at'},
        { text: '', value: 'actions', sortable: false, width: '68px'}
      ],
      defaultItem: {
				webhook: '',
				order_id: '',
			},
      menu1: false,
      menu2: false,
      start_date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      end_date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
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

		openOrderQueueDialog () {
      this.order_queue = {
        webhook: '',
				order_id: '',
      }
      this.order_queue_dialog = true
    },

    closeOrderQueueDialog () {
      this.order_queue_dialog = false
    },

    // Get Logs
    getlogs() {
      this.loading_data = 'black';
      this.$Axios.get(this.$backendURL + "/erp_integration/order_queue?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.order_logs = response.data.order_logs;
        this.loading_data = false;
      }, (error) => {
        this.order_logs = []
        this.loading_data = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },
    
    // Get Colors
    getColor (status) {
      if (status == "success") return 'teal'
      else if (status == "pending") return 'cyan'
      else if (status == "InProcess") return 'blue-grey'
      else return 'orange'
    },
    
    // Row Actions
    rowAction (id, action) {
      console.log(id, action);
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
    downloadOrderLogs() {
      window.open(this.$backendURL + "/erp_integration/download_order_queue_csv?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date)
    },

    // Repost Order
    repostItem(item) {
      this.loading_data = 'black';
      this.$Axios.post(this.$backendURL + "/erp_integration/repost_order?shop=" + this.$shop, {
          shop: this.$shop,
          id: item.id
        },{
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        this.loading_data = false;
        this.snackbar = true;
        this.snackbar_text = response.data.detail;
        this.getlogs()
      }, (error) => {
        console.log(error);
        this.snackbar = true;
        this.snackbar_text = error;
        this.loading_data = false;
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.$router.push('/error')
        }
      });
    },


    // Add data in order Quque
		saveOrderQueue() {
			this.loading_data = "black";
			this.$Axios.post(this.$backendURL + "/erp_integration/order_queue?shop=" + this.$shop, {
        shop: this.$shop,
        webhook: this.order_queue.webhook,
        order_id: this.order_queue.order_id,
      }, {
        headers: {
          'Authorization': this.$API_TOKEN.replace('%20', ' ')
        }
      }).then((response) => {
        console.log(response);
        this.loading_data = false;
        this.snackbar = true;
        this.snackbar_text = "Data Added";
        this.closeOrderQueueDialog()
        this.getlogs()
      }, (error) => {
        console.log(error);
        this.loading_data = false;
        this.snackbar = true;
        this.snackbar_text = error;
      });
		},

  }
}
