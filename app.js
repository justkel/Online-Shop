const path = require("path");

const express = require("express");

const csrf = require("csurf");
const expressSession = require("express-session")

const createSessionConfig = require("./config/session")

const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token")
const errorHandlingMiddleware = require("./middlewares/error-handler")
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');

const authRoutes = require("./routes/auth.routes")
const productsRoutes = require("./routes/products.route");
const baseRoutes = require("./routes/base.route");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use( '/products/assets', express.static("product-data"));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);  // added here because it should also be viewed by unauth people
app.use(protectRoutesMiddleware);
app.use('/orders', ordersRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlingMiddleware);

db.connectToDatabase()
  .then(() => {
    // The database connection is established
    console.log('Connected to MongoDB');
    
    // Start your Express app
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

