const problems = require('../models/problemsmodel')
const mongoose = require('mongoose')
const { generateFile } = require('../generateFile')
const { execute } = require('../execute')
const { compileAndRun } = require('../compileAndRun')
// const { compileAndRun } = require('../isolate_execute')
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
      // const filePath = await generateFile(language, code);
      // const output = await execute(language,filePath,id,user_id);
      const { authorization } = req.headers
      const payload = {
        // language: 'cpp',
        language,code,id,user_id
      }  
      const response = await fetch(`${process.env.DOCKERIZED_BACKEND}/api/oj/`, {
        method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authorization/*`Bearer ${user.token}`*/
            }
      })
      const output = await response.json()
      // console.log(output)
      // const output = await compileAndRun(language,filePath,id,user_id);
      res.json(output );
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

module.exports = {
  getproblems,
  getproblem,
  sendcode,
  getsubmissions,
  getcode
}