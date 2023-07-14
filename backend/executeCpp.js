const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const problems = require('./models/problemsmodel')
const submissions = require('./models/submissionsmodel')
const User = require('./models/userModel')
const mongoose = require('mongoose')
// const express = require('express')
// const app = express()

// middleware
// app.use(express.json())

const outputPath = path.join(__dirname, "outputs")

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
}

const executeCpp = async (filepath,id,user_id) => {

    const problem = await problems.findById(id) 
    const user = await User.findById(user_id) 
    const input = problem.ip // Your input string
    const output=problem.op
    // const fs = require('fs');
    // const path = require('path');
    const { v4: uuid } = require('uuid')

    const dirtest = path.join(__dirname, 'testcases')

if (!fs.existsSync(dirtest)) {
    fs.mkdirSync(dirtest, { recursive: true })
}

// const generateFile = async (format, content) => {
    const jobIDtest = uuid();
    const filename = `${jobIDtest}.txt`
    const filePathtest = path.join(dirtest, filename)
    fs.writeFileSync(filePathtest, input)
    // return filePath;
// };

// module.exports = {
//     generateFile,
// };

    const jobId = path.basename(filepath).split(".")[0]
    const outPath = path.join(outputPath, `${jobId}.exe`)

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filepath} -o ${outPath} && cd ${outputPath} && (.\\${jobId}.exe < "${filePathtest}")`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr })
                }
                if (stderr) {
                    reject(stderr)
                }
                const normalizeLineEndings = (text) => {
                    return text.replace(/\r\n/g, "\n")
                };

                // Inside your code

                const solution = normalizeLineEndings(stdout)
                const expectedOutput = normalizeLineEndings(output)
                // if (solution === expectedOutput) {
                //     stdout = 'Accepted ' + stdout
                // } else {
                //     stdout = 'Wrong Answer'
                // }

                // resolve(stdout)
                
                console.log(solution)
                console.log(expectedOutput)
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
                // console.log(stdout)
                resolve(stdout);
            }
        )
    })
//     const { spawn } = require('child_process');
// let output
// const cppProgram = spawn('g++', [`${filepath}`, '-o', `${outPath}`]);
// cppProgram.stdout.on('data', (data) => {
//   output=data
//   console.log(`stdout: ${data}`);
// });

// cppProgram.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// cppProgram.on('close', async(code) => {
//   if (code === 0) {
//     const program = spawn(`${outPath}`);
//     const problem = await problems.findById(id) 
//     const input = problem.ip // Your input string
//     program.stdin.write(input);
//     program.stdin.end();

//     program.stdout.on('data', (data) => {
//       console.log(`Output: ${data}`);
//       output=data
//     });

//     program.stderr.on('data', (data) => {
//       console.error(`Error: ${data}`);
//     });

//     program.on('close', (code) => {
//       console.log(`Child process exited with code ${code}`);
//     });
//   } else {
//     console.error(`Compilation error. Exit code ${code}`);
//   }
// });
// console.log(output)
// return output
};

module.exports = {
    executeCpp,
}