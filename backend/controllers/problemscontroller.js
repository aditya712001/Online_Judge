const problems = require('../models/problemsmodel')
const mongoose = require('mongoose')
const { generateFile } = require('../generateFile')
const { execute } = require('../execute')
const submissions = require('../models/submissionsmodel')

// get all problems
const getproblems = async (req, res) => {
  // const user_id = req.user._id

  const problemsdata = await problems.find({}).sort({createdAt: -1})
  res.status(200).json(problemsdata)
}

// get a single problem
const getproblem = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such problem'})
  }

  const problem = await problems.findById(id)

  if (!problem) {
    return res.status(404).json({error: 'No such problem'})
  }
  const normalize = (text) => {
    return text.replace(/\r\n/g, "\n");
}
// console.log(problem.statement)
  problem.statement=normalize(problem.statement)
  res.status(200).json(problem)
}

const sendcode = async (req, res) => {
  // const language = req.body.language;
  // const code = req.body.code;
  const user_id = req.user._id
  const { language = 'cpp', code } = req.body;
  const { id } = req.params

  if (code === undefined) {
      return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
      const filePath = await generateFile(language, code);
      const output = await execute(language,filePath,id,user_id);
      res.json({ filePath, output });
  } catch (error) {
      res.status(500).json({ error: error });
  }
}

// get all submissions
const getsubmissions = async (req, res) => {
  // const user_id = req.user._id
  const submissionsdata = await submissions.find({}).sort({createdAt: -1})
  // console.log(submissionsdata)
  res.status(200).json(submissionsdata)
}

// get a code
const getcode = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such problem'})
  }

  const code = await submissions.findById(id)

  if (!code) {
    return res.status(404).json({error: 'No such code'})
  }
  // console.log('here')
  res.download(code.solution)
}

// create new workout
// const createWorkout = async (req, res) => {
//   const {title, load, reps} = req.body

//   let emptyFields = []

//   if(!title) {
//     emptyFields.push('title')
//   }
//   if(!load) {
//     emptyFields.push('load')
//   }
//   if(!reps) {
//     emptyFields.push('reps')
//   }
//   if(emptyFields.length > 0) {
//     return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
//   }

//   // add doc to db
//   try {
//     const user_id = req.user._id
//     const workout = await Workout.create({title, load, reps, user_id})
//     res.status(200).json(workout)
//   } catch (error) {
//     res.status(400).json({error: error.message})
//   }
// }

// // delete a workout
// const deleteWorkout = async (req, res) => {
//   const { id } = req.params

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({error: 'No such workout'})
//   }

//   const workout = await Workout.findOneAndDelete({_id: id})

//   if (!workout) {
//     return res.status(400).json({error: 'No such workout'})
//   }

//   res.status(200).json(workout)
// }

// // update a workout
// const updateWorkout = async (req, res) => {
//   // new
//   const {title, load, reps} = req.body

//   let emptyFields = []

//   if(!title) {
//     emptyFields.push('title')
//   }
//   if(!load) {
//     emptyFields.push('load')
//   }
//   if(!reps) {
//     emptyFields.push('reps')
//   }
//   if(emptyFields.length > 0) {
//     return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
//   }

//   // update doc to db
//   try {
//   const { id } = req.params

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({error: 'No such workout'})
//   }

//   const workout = await Workout.findOneAndUpdate({_id: id}, {
//     ...req.body
//   })

//   if (!workout) {
//     return res.status(400).json({error: 'No such workout'})
//   }

//   res.status(200).json(workout)
// }
// catch (error) {
//   res.status(400).json({error: error.message})
// }
// }


module.exports = {
  getproblems,
  getproblem,
  sendcode,
  getsubmissions,
  getcode
  // createWorkout,
  // deleteWorkout,
  // updateWorkout
}