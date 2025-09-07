const express = require('express');
const router = express.Router();
// Simple analytics: counts of categories, users, plans (placeholder using collections)
router.get('/', async (req, res) => {
  try {
    const Category = require('../models/Category');
    const User = require('../models/User');
    const Plan = require('../models/Plan');
    const catCount = await Category.countDocuments();
    const userCount = await User.countDocuments();
    const planCount = await Plan.countDocuments();
    // simple aggregation: jobs per category (top 10)
    const Job = require('../models/Job');
    const agg = await Job.aggregate([ { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 } ]);
    res.render('pages/admin_analytics', { site: require('../data/site.json'), catCount, userCount, planCount, agg });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
});
module.exports = router;
