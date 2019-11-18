//base pacakges import
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path')
const fileupload = require('express-fileupload');
// const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db');


//security packages import



//Load env vars
dotenv.config({path:'./config/config.env'});

//Route files
const auth = require('./routes/auth');
const medicines = require('./routes/medicines');
// const auth = require('./routes/auth');
// const users = require('./routes/users');
// const reviews = require('./routes/reviews');


//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());


// //cookie parser
// app.use(cookieParser())

// //sanitize data
// // To remove data, use:
// app.use(mongoSanitize());

// //set secuirity headers
// app.use(helmet());

// //prevent xss attack
// app.use(xss());

// //rate limiting
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100
// });
// app.use(limiter);

// //prevent http param pollution
// app.use(hpp());

// //enable cors
// app.use(cors());

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname,'public')));


//Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/medicines', medicines);
// app.use('/api/v1/auth', auth);
// app.use('/api/v1/users', users);
// app.use('/api/v1/reviews', reviews);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejection
process.on('unhandledRejection',(err, promise)=>{
    console.log(`Error: ${err.message}`.red);
    //close server & exit process
    server.close(()=> process.exit(1));
})
