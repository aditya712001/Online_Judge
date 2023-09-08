const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require("path")
const problems = require('./models/problemsmodel')
const mongoose = require('mongoose')
const submissions = require('./models/submissionsmodel')
const User = require('./models/userModel')

const compileAndRun=async(language,filepath,id,user_id) => {
    const problem = await problems.findById(id)
    const user = await User.findById(user_id)  
    const input = problem.ip // Your input string
    const output=problem.op
    const timeLimit = 20000; // 10 seconds in milliseconds

    // const outputPath = filepath + '.exe';
    let outputPath = path.join(__dirname, "outputs")

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true })
    }
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
    
    const jobId = path.basename(filepath).split(".")[0]
    let executable=jobId
    let compileCommand=""
    let runCommand=""
    
    const currentDir = process.cwd();

    const normalize = (text) => {
        text=text.replace(/(\r\n|\n|\r)/gm, "\n");
        return text.trim();
    }

    if(language==="cpp"||language==="c"){
    if(os.platform()==="linux")
    executable+=".out"
    else
    executable+=".exe"
    outputPath = path.join(outputPath, executable)
    compileCommand = `docker run -v ${currentDir}:/usr/src/myapp -w /usr/src/myapp gcc:latest g++ ./codes/${jobId}.cpp -o ./outputs/${executable}`
    runCommand = `docker run -v ${currentDir}:/usr/src/myapp -w /usr/src/myapp gcc:latest sh -c "./outputs/${executable} < ./testcases/${filename}"`

    return new Promise((resolve, reject) => {

    exec(compileCommand, async(error, stdout, stderr) => {
        if (error || stderr) {
            const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
            await submissions.create({ verdict: "Compilation Error", title: problem.title, user: user.email, solution: filepath, time: time });
            console.log("Compilation Error")
            resolve("Compilation Error:\n"+stderr+"\nDuration: 0 ms");
            return;
        }
        const start = Date.now();
        const child = exec(runCommand, { maxBuffer: 10 * 10 * 1024 * 1024, timeout: timeLimit }, async (error, stdout, stderr) => {
            const duration = Date.now() - start;
            if (error) {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                if (error.killed) {
                    await submissions.create({ verdict: "Time Limit Exceeded", title: problem.title, user: user.email, solution: filepath, time: time });
                    resolve("Time Limit Exceeded");
                } else {
                    await submissions.create({ verdict: "Runtime Error", title: problem.title, user: user.email, solution: filepath, time: time });
                    resolve("Runtime Error:\n"+error.message);
                }
                return;
            }

            const actualOutput = normalize(stdout)
            const expectedOutput = normalize(output)
            console.log(actualOutput)
            console.log(expectedOutput)
            if (actualOutput === expectedOutput) {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Accepted", title: problem.title, user: user.email, solution: filepath, time: time });
                console.log("Accepted")
                resolve("Accepted");
            } else {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Wrong Answer", title: problem.title, user: user.email, solution: filepath, time: time });
                console.log("Wrong Answer")
                resolve("Wrong Answer");
            }
        });
    });
})
}

else if(language==="py"){
    executable+=".py"
    runCommand = `docker run -v ${currentDir}:/usr/src/myapp -w /usr/src/myapp python:3.8 sh -c "python ./codes/${executable} < ./testcases/${filename}"`;

    return new Promise((resolve, reject) => {

        const start = Date.now();
        const child = exec(runCommand, { maxBuffer: 10 * 10 * 1024 * 1024, timeout: timeLimit }, async (error, stdout, stderr) => {
            if (error) {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                if (error.killed) {
                    await submissions.create({ verdict: "Time Limit Exceeded", title: problem.title, user: user.email, solution: filepath, time: time });
                    resolve("Time Limit Exceeded");
                } else {
                    await submissions.create({ verdict: "Runtime Error", title: problem.title, user: user.email, solution: filepath, time: time });
                    resolve("Runtime Error:\n"+error.message);
                }
                return;
            }

            const actualOutput = normalize(stdout)
            const expectedOutput = normalize(output)
            console.log(actualOutput)

            if (actualOutput === expectedOutput) {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Accepted", title: problem.title, user: user.email, solution: filepath, time: time });
                console.log("Accepted")
                resolve("Accepted");
            } else {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Wrong Answer", title: problem.title, user: user.email, solution: filepath, time: time });
                console.log("Wrong Answer")
                resolve("Wrong Answer");
            }
        });
})
}
}

module.exports = {
    compileAndRun,
}