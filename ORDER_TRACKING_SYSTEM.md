# ORDER TRACKING SYSTEM

## Overview
The Order Tracking System introduces a real-time logical delivery pipeline, allowing customers to monitor the progression of their packages directly inside the `/account/dashboard`. The visual tracking is derived strictly from backend state edits made by the Admin team.

## Architecture & Integration
The tracking system maps linearly across 5 distinct timestamps and statuses governed by `AdminOrders`.

**Admin Action:** 
Admin changes an order status from the default (`Processing`) to a progressing status, triggering a DB edit inside the `orders` table.

**Allowed Status Values (Timeline Mapping):**
1. `Processing`
2. `Packing`
3. `Shipped`
4. `Out for Delivery`
5. `Delivered`

## Backend API
A lightweight polling endpoint was constructed allowing fast component checks:
- **`GET /api/v1/orders/:id/tracking`**: 
  - Retrieves the specific `order_id` string and the `order_status`.
  - Calculates the timeline mathematically within the backend `orderService`.

## Frontend Integration
The logic is cleanly decoupled into its own reusable modular UI component:

### `OrderTracking.jsx` Component
The frontend parses the `order_status` string string-matched against an array index to derive a `currentIndex` variable. 
It uses CSS mathematics to visually update a horizontal timeline indicating progress:

```javascript
style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
```

- **Lucide-React Assets Used**: `Clock`, `Package`, `Truck`, `MapPin`, `CheckCircle`.
- **Responsive Logic**: Renders as a full horizontal step-bar on Desktop, and elegantly collapses label text to a focused status display on Mobile width screens reducing noise.
- **Color Theming**: Dynamic class swaps occurring via template literals triggering the `ring-green-100` pulse on the active track line.

Whenever the `AuthContext` requests the `/profile` or `/orders` routes, these order statuses are injected dynamically rendering multiple Tracking instances out of the box per individual order inside the Customer Dashboard.
