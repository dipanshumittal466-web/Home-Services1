const mongoose = require('mongoose');
const Category = require('../models/Category');
const fs = require('fs');
require('dotenv').config();
const dataPath = __dirname + '/categories.json';
async function main(){
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homeservices');
  console.log('connected');
  await Category.deleteMany({});
  let categories = [];
  try{
    categories = JSON.parse(fs.readFileSync(dataPath));
  }catch(e){
    categories = [
      { name: 'Plumbing', slug: 'plumbing', icon: 'Plumbing.png' },
      { name: 'Painting', slug: 'painting', icon: 'paint-roller.png' },
      { name: 'AC Servicing', slug: 'ac-servicing', icon: 'air-conditioning.png' }
    ];
  }
  for(const c of categories){
    await Category.create({ name: c.name, slug: c.slug, icon: c.icon || 'default.png' });
  }
  console.log('seeded categories');
  process.exit(0);
}
main().catch(e=>{ console.error(e); process.exit(1); });
