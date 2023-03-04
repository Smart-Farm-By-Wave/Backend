const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// Require the router folder
const centralRoutes = require('./routes/centralRoutes')
const fieldRoutes = require('./routes/fieldRoutes')
const graphRoutes = require('./routes/graphRoutes')

const app = express();

// Global Middlewares

// Set Security HTTP headers
// app.use(helmet());

// Developement logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from the same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many request from this IP, please try again in an hour",
// });
// app.use("/", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10MB" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againtst XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [],
  })
);

//CORS!!!!!!!!!!
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// Route

// App route eg.
app.use('/api/central/', centralRoutes);
app.use('/api/field/', fieldRoutes);
app.use('/api/graph/', graphRoutes);


// Handle other invalid routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
