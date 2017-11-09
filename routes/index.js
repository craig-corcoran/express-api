const express = require('express');
const router = express.Router();

const { catchRequestError } = require('../controllers/errors');
const { routeFunction } = require('../controllers/database');


router.get('/', function (req, res) {
  res.send('Audit Data API');
});

router.get('/:routeParam', catchRequestError(getUserDocs));

async function getUserDocs(req, res) {
  const docs = await routeFunction(req.params.routeParam, req.query.queryParam);
  return res.json(docs);
}

module.exports = router;
