import dotenv from 'dotenv';
// The env variables needs to be configured here before importing any other file in the app entry
// this allows each imported file that uses the env vars to have access to them
// i.e if you do something like this :
// import connection from './src/models/db'
// import dotenv from 'dotenv'
// dotenv.config()
// the process.env vars used in the './src/models/db' file will be undefined which will cause connection errors
dotenv.config();
import express, { type Application } from 'express';
import { consoleLogger } from './src/services/logger';
import Server from './src/routes/index';

export const app: Application = express();
const port = process.env.PORT ?? 3000;
new Server(app);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to Film-o-mètre API' });
});

app.listen(port, () => {
  consoleLogger.error(`Server is listening at http://localhost:${port}`);
});
