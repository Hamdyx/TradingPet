const express = require('express');
const morgan = require('morgan');

const binanceRouter = require('./v1/routes/binanceRoutes');

const app = express();

// 1) Middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Custom Middlewares will be called each time there is a request
app.use((req, res, next) => {
	// console.log('Hello from the Middleware');
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Mounting Routers
app.use('/api/v1/binance', binanceRouter);

module.exports = app;
