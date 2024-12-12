import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';

import session from 'express-session';

import configRoutesFunction from './routes/index.js';
import {
	roleBasedRouting,
	routeLog,
	signOutUserMiddleWare,
} from './utils/middlewares/authMiddlewares.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
	session({
		name: 'AuthenticationState',
		secret: process.env.EXPRESS_SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(routeLog);
app.use(roleBasedRouting);
app.use('/auth/signoutuser', signOutUserMiddleWare);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));

app.engine(
	'handlebars',
	exphbs.engine({
		defaultLayout: 'main',
		helpers: {
			equals: function (a, b) {
				return a === b;
			},
			isEqual: (a, b) => a === b,
			add: (a, b) => a + b,
			or: (a, b) => a || b,
		},
	})
);

app.set('view engine', 'handlebars');

configRoutesFunction(app);

app.listen(PORT, () => {
	console.log(`Listning on http://localhost:${PORT}`);
});
