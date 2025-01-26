import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorLog } from "./utils/logger.js";
import auth from './routes/authRoute.js';
import supportOffice from './routes/supportOfficeRoute.js';


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/auth', auth);
app.use('/api/support-office', supportOffice);

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});
app.use( async (err, req, res, next) => {

    if(req.isApi){
        await errorLog(err);
        return res.status(500).send({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    };

    await errorLog(err);
    // return res.status(500).sendFile('./public/error.html');
    return res.status(500).send('500 error, Internal server error');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 85');
});