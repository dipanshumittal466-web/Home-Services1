
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.ORIGIN || '*', methods: ['GET','POST'] } });

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// DB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'homeservices' })
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.error('MongoDB error', err));

// Models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Message = require('./models/Message');
const VerificationDoc = require('./models/VerificationDoc');
const Notification = require('./models/Notification');

// Socket.io auth via token (optional simple)
io.use(async (socket, next) => {
  next();
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('joinRoom', (roomId) => socket.join(roomId));
  socket.on('chatMessage', async (payload) => {
    const msg = await Message.create(payload);
    io.to(payload.roomId).emit('chatMessage', msg);
  });
});

// Routes
const site = require('./data/site.json');
app.get('/', (req,res)=>res.render('index',{site}));
app.get('/services', (req,res)=>res.render('pages/services',{site}));
app.get('/pricing', (req,res)=>res.render('pages/pricing',{site}));
app.get('/about', (req,res)=>res.render('pages/about',{site}));
app.get('/contact', (req,res)=>res.render('pages/contact',{site}));
app.get('/login', (req,res)=>res.render('pages/login',{site}));
app.get('/dashboard', (req,res)=>res.render('pages/dashboard',{site}));
app.get('/admin', (req,res)=>res.render('pages/admin',{site}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/chat', require('./routes/chat')(io));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

const port = process.env.PORT;
httpServer.listen(port, () => console.log('Server running on port', port));

app.use('/api/users', require('./routes/users'));

app.use('/api/indemnity', require('./routes/indemnity'));

app.use('/api/categories', require('./routes/categories'));

app.use('/api/plans', require('./routes/plans'));

app.use('/api/manager', require('./routes/manager'));

app.use('/api/testimonials', require('./routes/testimonials'));

try{ require('./routes/payments_webhook')(app) }catch(e){ console.log('Webhook not mounted', e.message) }

app.use('/api/tradies', require('./routes/tradies'));

app.use('/api/reports', require('./routes/reports'));

app.use('/api/reports', require('./routes/reports_pdf'))
