const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin:(origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
   },
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   Credentials: true,   //cookies, http authentication with cross-origin requests
   optionsSuccessStatus: 200,    //CORS preflight checks
   allowedHeaders: 'Content-Type,Authorization',
};

module.exports = corsOptions;
