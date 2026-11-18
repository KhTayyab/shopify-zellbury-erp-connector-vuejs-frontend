# Zellbury ERP Connector — Frontend

Vue.js admin UI for **Zellbury ERP Connector**, an embedded Shopify app (by Alchemative) that connects Zellbury's Shopify store to the **Gtech ERP** and courier (3PL) partners.

Backend: [shopify-zellbury-erp-connector-django-backend](https://github.com/KhTayyab/shopify-zellbury-erp-connector-django-backend)

## Features

- **Orders** — view/search Shopify orders and their ERP posting status.
- **Order Queues** — monitor queued orders and repost failed ones.
- **Inventory Sync / Price Sync** — configure Gtech → Shopify sync schedules and view logs.
- **Fulfillment Events** — configure couriers (3PL), status mappings and exclusions; view event logs and retry.
- **Logs** — order, transaction and sale logs.
- **Settings** — Gtech integration, triggers and locations.

## Tech Stack

Vue 2, Vuetify 2, Vue Router, Axios, Vue CLI 4.

## Project Structure

```
src/
  main.js        # app bootstrap, backend URL ($backendURL)
  router/        # routes
  views/         # Orders, OrderQueues, InventorySync, PriceSync, Logs,
                 # TransactionLogs, SaleLogs, FulfillmentEvents,
                 # FulfillmentEventsLogs, Settings
```

## Configuration

The backend URL is set in `src/main.js`:

```js
Vue.prototype.$backendURL = "https://erp-backend.zellbury.com"
// Vue.prototype.$backendURL = "http://localhost:8000"   // local
```

## Local Setup

```bash
yarn install
yarn serve     # dev server at http://localhost:8080
yarn build     # production build in dist/
yarn lint
```

## Docker

```bash
docker build -t zellbury-erp-frontend .
```
