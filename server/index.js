require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500;
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const ROLES_LIST = require('./config/roles_list');
const verifyRoles = require('./middleware/verifyRoles');

connectDB();

app.use(credentials)

app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'/public')));

app.use('/auth', require('./routes/authRoutes'));

app.use(verifyJWT);

app.use('/api', require('./routes/userRoutes'));

app.use('/call',require('./routes/callRoutes'));

app.use('/message',require('./routes/messageRoutes'));

app.use('/journals' , require('./routes/journalRoutes'));

app.use('/' , require('./routes/event.routes'));

app.use('/' , require('./routes/ticket.routes'))

app.use('/report', require('./routes/reportRoutes'));


app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));