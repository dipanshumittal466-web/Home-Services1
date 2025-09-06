const router = require('express').Router();
const PDFDocument = require('pdfkit');
const Job = require('../models/Job');
const Dispute = require('../models/Dispute');
const Application = require('../models/Application');

function header(doc, title){
  doc.rect(0,0,612,60).fill('#0ea5e9');
  doc.fill('#ffffff').fontSize(16).text('Mittal Industry – HomeServices', 24, 20, { continued: true });
  doc.fontSize(12).text('  |  '+title);
  doc.moveDown().fill('#111827');
  try { doc.image('templates/logo.jpeg', 500, 20, {fit:[80,40]}); } catch(e) {}

}

function table(doc, rows, columns){
  const startX = 24, startY = 90, rowH = 22;
  let y = startY;
  doc.fontSize(10).fill('#111827');
  // header
  columns.forEach((c, i) => { doc.text(c.label, startX + i*c.width, y); });
  y += rowH;
  doc.moveTo(startX, y-6).lineTo(588, y-6).stroke('#e5e7eb');
  rows.forEach(r => {
    columns.forEach((c, i) => { doc.text(String(r[c.key] ?? ''), startX + i*c.width, y, { width: c.width-6 }); });
    y += rowH;
  });
  return y;
}

router.get('/admin/analytics.pdf', async (req,res)=>{
  const doc = new PDFDocument({ size: 'LETTER', margin: 24 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename="analytics.pdf"');
  doc.pipe(res);
  header(doc, 'Analytics Report');
  const jobs = await Job.find().select('title budget status createdAt').limit(500);
  const rows = jobs.map(j => ({ title: j.title, budget: j.budget, status: j.status, createdAt: new Date(j.createdAt).toISOString().substring(0,10) }));
  table(doc, rows, [
    { key:'title', label:'Title', width: 220 },
    { key:'budget', label:'Budget', width: 90 },
    { key:'status', label:'Status', width: 100 },
    { key:'createdAt', label:'Created', width: 130 },
  ]);
  doc.end();
});

router.get('/admin/disputes.pdf', async (req,res)=>{
  const doc = new PDFDocument({ size: 'LETTER', margin: 24 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename="disputes.pdf"');
  doc.pipe(res);
  header(doc, 'Disputes Report');
  try{
    const disputes = await Dispute.find().select('job reporter status createdAt').limit(500).populate('job reporter','title email');
    const rows = disputes.map(d => ({ job: d.job?.title || d.job, reporter: d.reporter?.email || d.reporter, status: d.status, createdAt: new Date(d.createdAt).toISOString().substring(0,10) }));
    table(doc, rows, [
      { key:'job', label:'Job', width: 220 },
      { key:'reporter', label:'Reporter', width: 160 },
      { key:'status', label:'Status', width: 80 },
      { key:'createdAt', label:'Created', width: 90 },
    ]);
  }catch(e){
    doc.text('No disputes or error fetching disputes.');
  }
  doc.end();
});

router.get('/manager/:managerId/invoices.pdf', async (req,res)=>{
  const doc = new PDFDocument({ size: 'LETTER', margin: 24 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename="invoices.pdf"');
  doc.pipe(res);
  header(doc, 'Invoices Report');
  try{
    const Job = require('../models/Job');
    const Application = require('../models/Application');
    const jobs = await Job.find({ poster: req.params.managerId }).select('_id title budget createdAt');
    const jobIds = jobs.map(j => j._id);
    const apps = await Application.find({ job: { $in: jobIds } }).select('job tradie bid createdAt').limit(1000);
    const rows = apps.map(a => {
      const job = jobs.find(j => j._id.equals(a.job));
      return { jobTitle: job?.title || a.job, bid: a.bid || '', tradie: String(a.tradie), createdAt: new Date(a.createdAt).toISOString().substring(0,10) };
    });
    table(doc, rows, [
      { key:'jobTitle', label:'Job', width: 240 },
      { key:'bid', label:'Bid', width: 80 },
      { key:'tradie', label:'Tradie', width: 160 },
      { key:'createdAt', label:'Created', width: 90 },
    ]);
  }catch(e){
    doc.text('No data or error building invoices.');
  }
  doc.end();
});

module.exports = router;
