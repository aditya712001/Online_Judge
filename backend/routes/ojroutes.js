const express = require('express')
const {
//   createWorkout,
  getproblems,
  getproblem,
  sendcode,
  getsubmissions,
  getcode
//   deleteWorkout,
//   updateWorkout
} = require('../controllers/problemscontroller')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all problems routes
router.use(requireAuth)

// GET all problems
router.get('/problems', getproblems)

//GET a single problem
router.get('/problems/:id', getproblem)

//POST code
router.post('/problems/:id', sendcode) 

// GET all submissions
router.get('/', getsubmissions)

// GET code
router.get('/solutions/:id', getcode)
// // POST a new workout
// router.post('/', createWorkout)

// // DELETE a workout
// router.delete('/:id', deleteWorkout)

// // UPDATE a workout
// router.patch('/:id', updateWorkout)


module.exports = router