const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const problems = require('./models/problemsmodel')
const mongoose = require('mongoose');
const { stdout } = require("process");
// const express = require('express')
// const app = express()

// middleware
// app.use(express.json())

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filepath,id) => {
    const problem = await problems.findById(id) 
    const input = problem.ip // Your input string
    const output=problem.op
    // const fs = require('fs');
    // const path = require('path');
    const { v4: uuid } = require('uuid');

    const dirtest = path.join(__dirname, 'testcases');

if (!fs.existsSync(dirtest)) {
    fs.mkdirSync(dirtest, { recursive: true });
}

// const generateFile = async (format, content) => {
    const jobIDtest = uuid();
    const filename = `${jobIDtest}.txt`;
    const filePathtest = path.join(dirtest, filename);
    fs.writeFileSync(filePathtest, input);
    // return filePath;
// };

// module.exports = {
//     generateFile,
// };

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filepath} -o ${outPath} && cd ${outputPath} && (.\\${jobId}.exe < "${filePathtest}")`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject(stderr);
                }
                const solution=stdout
                console.log(solution)
                console.log(output)
                if(solution===output)
                stdout="Accepted\n"+stdout
                else
                stdout="Wrong Answer"
                resolve(stdout);
            }
        );
    });
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
};