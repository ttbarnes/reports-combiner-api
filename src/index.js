/* eslint-disable */

import http from 'http';
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import api from './api';
import passportConfig from './config/passport';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

initializeDb((db) => {
	app.use(passport.initialize());
	passportConfig(passport);

	// api router
	app.use('/api', api({ config }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;

/* eslint-enable */
