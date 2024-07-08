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
      request_type: '',
      order_number: '',
      shopify_order_id: '',
      customer_name: '',
      number: '',
      created_at: '',
      response_code: '',
      response_message: '',
      request_body: '',
      showFilters: false,
      loading_data: 'black',
      logs: [],
      itemsPerPage: 10,
      selected: [],
      columns: [
        { text: 'Request Type', value: 'request_type', show: true },
        { text: 'Order', value: 'order_number', show: true },
        { text: 'Order ID', value: 'shopify_order_id', show: true },
        { text: 'Customer name', value: 'customer_name', show: true },
        { text: 'Phone', value: 'number', show: true },
        { text: 'Datetime', value: 'created_at', show: true, dataType: "Date"},
        { text: 'Response Code', value: 'response_code', show: true, width: '150px' },
        { text: 'Response Message', value: 'response_message', show: true, width: '300px'},
        { text: 'Request Body', value: 'request_body', show: true, width: '300px'},
      ],
      headers: [
        { text: 'Request Type', value: 'request_type', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'request_type' ].toLowerCase() ) }},
        { text: 'Order', value: 'order_number', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'order_number' ].toLowerCase() ) }},
        { text: 'Order ID', value: 'shopify_order_id', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'shopify_order_id' ].toLowerCase() ) }},
        { text: 'Customer name', value: 'customer_name', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'customer_name' ].toLowerCase() ) }},
        { text: 'Phone', value: 'number', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'number' ].toLowerCase() ) }},
        { text: 'Datetime', value: 'created_at', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'created_at' ].toLowerCase() ) }},
        { text: 'Response Code', value: 'response_code', width: '150px', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'response_code' ].toLowerCase() ) }},
        { text: 'Response Message', value: 'response_message', width: '300px', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'response_message' ].toLowerCase() ) }},
        { text: 'Request Body', value: 'request_body', width: '300px', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'request_body' ].toLowerCase() ) }},
      ],
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
    
    // Get Logs
    getlogs() {
      this.loading_data = 'black';
      this.$Axios.get(this.$backendURL + "/erp_integration/logs?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date, {
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
    
    // Get Colors
    getColor (status) {
      if (status == "fulfilled") return 'green'
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
    downloadLogs() {
      window.open(this.$backendURL + "/erp_integration/download_logs_csv?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date)
    }
  }
}
