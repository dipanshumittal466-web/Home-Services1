require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public'))); app.use('/favicon', express.static(path.join(__dirname, 'public','favicon')));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homeservices').then(()=>console.log('mongo ok')).catch(e=>console.error(e));
app.get('/', (req,res)=> res.send('HomeServicesEtc Backend'));
app.use('/api/categories', require('./routes/categories'));
try{ app.use('/api/indemnity', require('./routes/indemnity')); }catch(e){}
const port = process.env.PORT || 10000;
app.listen(port, ()=> console.log('listening', port));

// Admin analytics
try{ app.use('/admin/analytics', require('./routes/admin_analytics')); }catch(e){ console.log('analytics route missing', e.message) }

try{ require('./cron/autoRenew')(); }catch(e){ console.log('autoRenew cron not loaded', e.message) }
