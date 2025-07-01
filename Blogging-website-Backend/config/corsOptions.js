const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin like mobile apps or curl requests
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE', 'OPTIONS'],
    credentials: true,   // Allows cookies and credentials to be sent
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
