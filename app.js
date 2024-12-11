import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';

import configRoutesFunction from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.engine(
	'handlebars',
	exphbs.engine({
		defaultLayout: 'main',
		helpers: {
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
