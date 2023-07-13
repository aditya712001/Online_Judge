const express = require('express')
const {
//   createWorkout,
  getproblems,
  getproblem,
  sendcode
//   deleteWorkout,
//   updateWorkout
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

// // POST a new workout
// router.post('/', createWorkout)

// // DELETE a workout
// router.delete('/:id', deleteWorkout)

// // UPDATE a workout
// router.patch('/:id', updateWorkout)


module.exports = router