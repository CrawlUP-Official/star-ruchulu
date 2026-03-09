# STAR RUCHULU SYSTEM ARCHITECTURE

## 1️⃣ SYSTEM OVERVIEW

**Star Ruchulu** is a premium ecommerce platform specializing in authentic, homemade Andhra flavours, delivering traditional pickles, sweets, and snacks pan-India.

### Core Purpose
To provide a seamless browsing, purchasing, and order management experience for customers, while empowering the internal team with a robust, custom-built Admin Portal to manage inventory, combos, orders, and customer engagement.

### Target Users
- **Customers**: Can browse the product catalog, add items/combos to the cart, checkout securely, and subscribe to newsletters.
- **Admin**: Can manage the entire store via a secured admin dashboard. This includes adding/editing products, managing custom combos, processing customer orders, and tracking emails.

### Core Features
- **Product Catalog**: Dynamic categories (Veg Pickles, Sweets, Snacks) with region and spice level indicators.
- **Combos**: Bundled offerings mapped directly to products.
- **Orders**: Cart-to-checkout flow ending in database insertion and email notifications.
- **Email Notifications**: Automated HTML emails for welcome coupons and order confirmations.
- **Admin Management**: Full CRUD operations for products, orders, combos, and customers.

### High-Level Architecture
```text
React Frontend (Vite)
      ↓  (Axios HTTP Requests)
Express Backend (Node.js API)
      ↓  (mysql2 connection pool)
MySQL Database
      ↓  (Nodemailer)
Email Service (Ethereal test / Gmail SMTP)
      ↓  (Multer)
File Storage (Local Uploads)
```

## 2️⃣ FRONTEND ARCHITECTURE

- **Framework**: React.js bundled via Vite for high performance.
- **Routing**: React Router DOM (`react-router-dom`) handles client-side page transitions without refreshing.
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`) handle local state. The `CartContext` manages global cart state. Let's assume Context API is used for the cart.
- **API Communication**: `Axios` instances configured with base URLs and interceptors communicate directly with the backend API.
- **Image Handling**: Static images served from `public/images/`, while dynamic uploads are served from the backend's `/uploads/` directory.
- **Responsive Layout**: Tailwind CSS is used extensively for mobile-first, responsive layouts.

### Important Frontend Folders
`src/`
- `pages/`: Contains the main route components (e.g., `Home.jsx`, `Shop.jsx`, `Checkout.jsx`).
- `pages/admin/`: Encloses all secure admin pages (`AdminDashboard.jsx`, `AdminProducts.jsx`).
- `components/`: Reusable UI pieces (`Navbar.jsx`, `Footer.jsx`, `ProductCard.jsx`, `ConfirmModal.jsx`).
- `services/`: API layer configurations (`api.js`), abstracting axios calls.
- `assets/`: Static resources like icons, placeholder images, and global CSS (`index.css`).

## 3️⃣ MAIN WEBSITE PAGE RESPONSIBILITY

### `/` — Home Page
**Purpose:** Displays the landing page of the ecommerce store.
**Responsibilities:**
- Display hero section
- Show best sellers (dynamically filtered)
- Show special combos
- Show brand story
- Show testimonials
**API Calls:**
- `GET /api/v1/products`
- `GET /api/v1/combos`
**Components Used:**
- `Hero`
- `BestSellerCarousel` / `CategoryGrid`
- `ComboSection`
- `Testimonials`
- `Footer` (NewsletterSubscription)

### `/shop`
**Purpose:** Main product catalog.
**Responsibilities:**
- Show all products
- Filtering by category (Veg Pickles, Sweets, Snacks)
- Searching logic
- Display weight variants and pricing
**API Calls:**
- `GET /api/v1/products`

### `/product/:id`
**Purpose:** Product detail page.
**Responsibilities:**
- Show product image
- Show weight variants and dynamically update price
- Show spice level and region
- Add quantity to cart
**API Calls:**
- `GET /api/v1/products/:id`

### `/cart`
**Purpose:** Display selected items before checkout.
**Responsibilities:**
- List cart items
- Quantity change increment/decrement
- Remove items
- Calculate subtotal
**Data Source:**
- React Context / `localStorage` cart state

### `/checkout`
**Purpose:** Collect customer order details.
**Responsibilities:**
- Address and shipping form
- Payment selection (e.g., Cash on Delivery)
- Submit order payload
**API Calls:**
- `POST /api/v1/orders`

### `/contact`
**Purpose:** Allow users to send messages and feedback.
**API Calls:**
- `POST /api/v1/contact`

### Newsletter Subscription (Footer)
**Purpose:** Allow users to subscribe for introductory offers and updates.
**API Calls:**
- `POST /api/v1/subscribe`

## 4️⃣ ADMIN PANEL ARCHITECTURE

The Admin Panel operates as a segregated Single Page Application experience embedded within the main React app.
- **Authentication**: Validated via a login endpoint. On success, an auth token or session flag is saved to `localStorage` (e.g., `adminToken`).
- **Protected Routes**: A `ProtectedRoute` wrapper component checks for the authentication token in `localStorage`. If missing, the user is redirected to `/admin.in/login`.

## 5️⃣ ADMIN PAGE RESPONSIBILITIES

### `/admin.in/login`
**Purpose:** Admin authentication page.
**Responsibilities:**
- Validate admin credentials
- Store auth token in `localStorage`
- Redirect to dashboard

### `/admin.in/dashboard`
**Purpose:** Admin overview page.
**Displays:**
- Total orders, total customers, total revenue
- Recent orders list
- Top selling products
**API Calls:**
- `GET /api/v1/orders`
- `GET /api/v1/products`
- `GET /api/v1/subscribe` (for subscription metrics)

### `/admin.in/products`
**Purpose:** Manage product catalog.
**Features:**
- Add product
- Edit product metadata and pricing
- Delete product (with `ConfirmModal` protection)
- Upload product images
- Toggle "Best Seller" badge
- Manage weight variants
**API Calls:**
- `GET /api/v1/products`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

### `/admin.in/orders`
**Purpose:** Manage customer orders.
**Features:**
- View order list
- View detailed order break-downs (items, weights, customer info)
- Update order status (Processing, Shipped, Delivered)
- Delete order
**API Calls:**
- `GET /api/v1/orders`
- `PUT /api/v1/orders/:id/status`
- `DELETE /api/v1/orders/:id`

### `/admin.in/subscriptions`
**Purpose:** Manage newsletter subscribers.
**Features:**
- View active subscribers and assigned coupons.
- Bulk view / email lists.
- Delete inactive subscribers.
**API Calls:**
- `GET /api/v1/subscribe`
- `DELETE /api/v1/subscribe/:id`

### `/admin.in/customers`
**Purpose:** Customer relationship management.
**Features:**
- View lists of unique customer emails.
- Track total orders and money spent per customer.
- Delete customer (which cascades to their order history).
**API Calls:**
- Custom aggregations typically retrieved via `GET /api/v1/orders`.

### `/admin.in/contact-messages`
**Purpose:** View customer inquiries.
**API Calls:**
- `GET /api/v1/contact`
- `DELETE /api/v1/contact/:id`

## 6️⃣ BACKEND ARCHITECTURE

The backend is a monolithic Express.js REST API utilizing a modular, MVC-like folder structure.

- `server.js` (or `app.js`): The entry point. Initializes Express, configures global middleware (CORS, JSON parsing), serves static uploaded files, connects routing, and starts the server.
- `routes/`: Maps specific API URLs (e.g., `/products`, `/orders`) to the appropriate Controller functions.
- `controllers/`: Handles incoming HTTP requests, extracts parameters/body data, delegates business logic to Services, and returns HTTP responses (200, 400, 500).
- `services/`: Contains the core business logic (e.g., calculating totals, orchestrating database transactions, formatting emails).
- `models/`: Directly interfaces with the MySQL database. Contains raw SQL queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) utilizing the `mysql2` connection pool.
- `config/`: Holds database connection setups and environmental variable bindings.
- `middleware/`: Reusable validation or processing interceptors (e.g., `multer` file upload configuration).

## 7️⃣ DATABASE ARCHITECTURE

The platform uses a relational MySQL database.

### `products`
**Purpose**: Stores base catalog data (name, category, region, spice level).
**Relations**: Has many `product_weights`. Has many `order_items`. Has many `combo_items`.

### `product_weights`
**Purpose**: Defines price points for different weight variations (e.g., 250g, 500g) for a specific product.
**Relations**: Belongs to `products`.

### `combos`
**Purpose**: Stores bundled combination offerings.
**Relations**: Has many `combo_items`.

### `combo_items`
**Purpose**: Maps a specific product and weight to a parent combo.
**Relations**: Belongs to `combos` and `products`.

### `orders`
**Purpose**: Stores top-level transaction data, customer details, and shipping address.
**Relations**: Has many `order_items`.

### `order_items`
**Purpose**: Line items detailing exactly what product, weight, and quantity was purchased in an order.
**Relations**: Belongs to `orders` and `products`.

### `subscriptions`
**Purpose**: Stores newsletter emails and issued discount coupons.
**Relations**: Standalone table.

### `contacts`
**Purpose**: Stores messages submitted via the Contact Us form.
**Relations**: Standalone table.

**Relational Flow Example:**
`products` ↔️ `product_weights`
`products` → `order_items` ← `orders`
`products` → `combo_items` ← `combos`

## 8️⃣ ORDER FLOW EXPLANATION

Step-by-step logic when a customer makes a purchase:

1. **Cart Creation**: Customer adds an item (specifying weight and quantity) → Cart array is updated and stored in `localStorage`.
2. **Checkout Review**: Customer navigates to `/checkout` and reviews the cart subtotal.
3. **Form Submission**: Customer fills detailed address and contact info, then submits the form.
4. **API Request**: The frontend makes a `POST /api/v1/orders` request containing customer details and the item array.
5. **Backend Processing**:
   - Controller receives payload and passes it to `orderService`.
   - Backend begins a MySQL **Transaction** to ensure data integrity.
   - Saves parent record into the `orders` table to generate an `order_id`.
   - Iterates over cart, saving each item to the `order_items` table.
   - Transaction is `COMMITTED`.
6. **Email Trigger**: The `orderService` calls `emailService.sendOrderConfirmationEmail()`.
7. **Customer Notification**: Backend returns 200 OK. Frontend clears the cart and redirects the user to an Order Success screen. Customer receives the HTML email receipt.

## 9️⃣ EMAIL SYSTEM ARCHITECTURE

- **Library**: `Nodemailer`.
- **System Logic**: A singleton `transporter` is initialized at server startup.
- **SMTP**: If `SMTP_USER` and `SMTP_PASS` exist in `.env`, it connects to Gmail SMTP. If they are missing, it automatically provisions an **Ethereal** test account, logging preview URLs to the backend console.
- **Email Templates**: HTML payloads utilizing inline CSS and branding colors are passed into the mailer.
- **Automated Emails Sent**:
  - **Subscription Welcome**: Triggered on `POST /subscribe`. Sends a "Welcome to the Family" note with the generated 10% OFF coupon explicitly formatted.
  - **Order Confirmation**: Triggered on `POST /orders`. Sends a receipt containing order ID, delivery address, tabular item breakdown, and total cost.

## 🔟 FILE UPLOAD ARCHITECTURE

Handling admin product images:
- **Middleware**: `multer` is configured in `src/middleware/uploadMiddleware.js`.
- **Upload Directory**: Files are physically saved locally to `/uploads/` on the backend server.
- **Validation**: Multer intercepts the file stream, checks for expected MIME types (`image/jpeg`, `image/png`) and enforces file size limits.
- **File Serving**: Express is configured to serve static files (`app.use('/uploads', express.static(...))`).
- **Storage Strategy**: The backend parses the filename, constructs a full URL (`http://localhost:5000/uploads/filename.jpg`), and saves this URL string to the `image_url` column in the `products` table.
