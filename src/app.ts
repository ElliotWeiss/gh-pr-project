import express, { Application } from 'express';
import axios, { AxiosResponse } from 'axios';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import pullReqestRouter from './routes/pullRequest'

const SERVER_PORT: string = '8080';

/** Initialize application */
const app: Application = express();

/** Application-wide Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

/** Routes */
app.use("/pr", pullReqestRouter);

app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}...`));

export default app;