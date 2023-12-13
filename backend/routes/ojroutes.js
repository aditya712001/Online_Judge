const express = require('express')
const {
  getproblems,
  getproblem,
  sendcode,
  getsubmissions,
  getcode
} = require('../controllers/problemscontroller')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all problems routes
router.use(requireAuth)

// GET all problems
router.get('/', getproblems)

//GET a single problem
router.get('/:id', getproblem)

//POST code
router.post('/:id', sendcode) 

// GET all submissions
router.get('/submissions/solutions', getsubmissions)

// GET code
router.get('/submissions/solutions/:id', getcode)


module.exports = router