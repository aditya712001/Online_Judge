const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const problems = require('./models/problemsmodel')
const submissions = require('./models/submissionsmodel')
const User = require('./models/userModel')
const mongoose = require('mongoose')

const outputPath = path.join(__dirname, "outputs")

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
}

const executeCpp = async (filepath,id,user_id) => {

    const problem = await problems.findById(id) 
    const user = await User.findById(user_id) 
    const input = problem.ip // Your input string
    const output=problem.op
    
    const { v4: uuid } = require('uuid')

    const dirtest = path.join(__dirname, 'testcases')

if (!fs.existsSync(dirtest)) {
    fs.mkdirSync(dirtest, { recursive: true })
}

// const generateFile = async (format, content) => {
    const jobIDtest = uuid();
    const filename = `${jobIDtest}.txt`
    const filePathtest = path.join(dirtest, filename)
    const normalize = (text) => {
        return text.replace(/\r\n/g, "\n");
    }
    fs.writeFileSync(filePathtest, input)

    const jobId = path.basename(filepath).split(".")[0]
    const outPath = path.join(outputPath, `${jobId}.out`)

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .//${jobId}.out < ${filePathtest}`,
                (error, stdout, stderr) => {
                    console.log(stdout)
                if (error) {
                    // submissions.create({verdict:"Error",title:problem.title,user:user.email,solution:filepath})
                    // reject({ error, stderr })
                    // stdout=error.signal
                    // resolve(stdout);
                }
                if (stderr) {
                    submissions.create({verdict:"Compilation Error",title:problem.title,user:user.email,solution:filepath})
                    // reject(stderr)
                    stdout=stderr
                    resolve(stdout);
                }
                    
                const solution = normalize(stdout)
                const expectedOutput = normalize(output)
                
                if(solution===expectedOutput)
                {
                    submissions.create({verdict:"Accepted",title:problem.title,user:user.email,solution:filepath})
                    stdout="Accepted\n"+stdout
                }
                else
                {
                    stdout="Wrong Answer"
                    submissions.create({verdict:"Wrong Answer",title:problem.title,user:user.email,solution:filepath})
                }
                resolve(stdout);
            }
        )
    })
};

module.exports = {
    executeCpp,
}