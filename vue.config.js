module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/frontend', // Ensure this is uncommented and set correctly
  devServer: {
    disableHostCheck: true,
    port: 8080, // Expose the app on port 8080
    // allowedHosts: ['1954-157-10-226-78.ngrok-free.app', 'candela-connector.alchemative.net']
  }
}