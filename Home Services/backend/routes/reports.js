const router = require('express').Router();
const { Parser } = require('json2csv');
const Job = require('../models/Job');
const Dispute = require('../models/Dispute');
const Application = require('../models/Application');

function csv(res, data, filename){
  const parser = new Parser();
  const csv = parser.parse(data);
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition',`attachment; filename="${filename}"`);
  res.send(csv);
}

// Admin analytics CSV
router.get('/admin/analytics.csv', async (req,res)=>{
  const jobs = await Job.find().select('title budget status createdAt');
  const rows = jobs.map(j => ({ title: j.title, budget: j.budget, status: j.status, createdAt: j.createdAt }));
  csv(res, rows, 'analytics.csv');
});

// Admin disputes CSV
router.get('/admin/disputes.csv', async (req,res)=>{
  try{
    const disputes = await Dispute.find().select('job reporter status createdAt');
    const rows = disputes.map(d => ({ job: d.job, reporter: d.reporter, status: d.status, createdAt: d.createdAt }));
    csv(res, rows, 'disputes.csv');
  }catch(e){
    csv(res, [], 'disputes.csv');
  }
});

// Manager invoices CSV (simple: applications per job with bid amount if present)
router.get('/manager/:managerId/invoices.csv', async (req,res)=>{
  const jobs = await Job.find({ poster: req.params.managerId }).select('_id title budget createdAt');
  const jobIds = jobs.map(j => j._id);
  const apps = await Application.find({ job: { $in: jobIds } }).select('job tradie bid createdAt');
  const rows = apps.map(a => {
    const job = jobs.find(j => j._id.equals(a.job));
    return { jobTitle: job?.title, bid: a.bid, tradie: a.tradie, createdAt: a.createdAt };
  });
  csv(res, rows, 'manager_invoices.csv');
});

module.exports = router;
