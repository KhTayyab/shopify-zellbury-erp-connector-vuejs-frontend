// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar';
import moment from 'moment'
import { format, parseISO } from 'date-fns'

export default {
  name: 'TransactionLogs',
  components: {
    Navbar
  },
  data () {
    return {
      search: '',
      showFilters: false,
      loading_data: true,
      logs: [],
      itemsPerPage: 10,
      selected: [],
      columns: [
        { text: 'Action', value: 'action', show: true },
        { text: 'Status', value: 'status', show: true },
        { text: 'Description', value: 'description', show: true },
        { text: 'Download Link', value: 'link', show: true },
        { text: 'No of Items', value: 'sku_sync_count', show: true },
        { text: 'Charges', value: 'calculated_amount', show: true },
        { text: 'Datetime', value: 'created_at', show: true, dataType: "Date"}
      ],
      headers: [
        { text: 'Action', value: 'action'},
        { text: 'Status', value: 'status' },
        { text: 'Description', value: 'description' },
        { text: 'Download Link', value: 'link' },
        { text: 'No of Items', value: 'sku_sync_count' },
        { text: 'Charges', value: 'calculated_amount' },
        { text: 'Datetime', value: 'created_at' }
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
      this.loading_data = true;
      this.$Axios.get(this.$backendURL + "/erp_integration/transaction_logs?shop=" + this.$shop + "&start_date=" + this.start_date + "&end_date=" + this.end_date, {
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
      if (status == true) return 'teal'
      else if (status == false) return 'cyan'
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

    copyText(text) {
			var input = document.createElement("input");
			document.body.appendChild(input);
			input.value = text;
			
			input.select();
			input.setSelectionRange(0, 99999);
			
			document.execCommand("copy");
			
			document.body.removeChild(input);
			
			this.snackbar_text = "Link copied!";
			this.snackbar = true;
		},
  }
}
