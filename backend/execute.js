const os=require("os")
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

const execute = async (language,filepath,id,user_id) => {

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
        text=text.replace(/(\r\n|\n|\r)/gm, "\n");
        return text.trim();
    }
    fs.writeFileSync(filePathtest, input)
    
    const jobId = path.basename(filepath).split(".")[0]
    let executable=jobId
    let command=""
    if(language==="cpp"||language==="c"){
    if(os.platform()==="linux")
    executable+=".out"
    else
    executable+=".exe"
    // const outPath = path.join(outputPath, `${jobId}.exe`)
    const outPath = path.join(outputPath, executable)
    
    command=`g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${executable} < ${filePathtest} `
    if(os.platform()==="linux")
    command=`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${executable} < ${filePathtest} `
    }

    if (language == "py") {
        // command = `py ${filepath} < ${filePathtest} `;
        // if (os.platform() === "linux")
          command = `python ${filepath} < ${filePathtest} `;
      }
      
      return new Promise((resolve, reject) => {
        const timeLimit = 700;
        const child = exec(command, async (error, stdout, stderr) => {
            if (stderr) {
                console.log(stderr)
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Compilation Error", title: problem.title, user: user.email, solution: filepath, time: time });
                reject("Compilation Error:\n\n"+stderr);
                return;
            }
    
            const solution = normalize(stdout);
            const expectedOutput = normalize(output);
            console.log(solution)
            if (solution === expectedOutput) {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Accepted", title: problem.title, user: user.email, solution: filepath, time: time })
                resolve("Accepted");
            } else {
                const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                await submissions.create({ verdict: "Wrong Answer", title: problem.title, user: user.email, solution: filepath, time: time });
                resolve("Wrong Answer");
            }
        });
        
        const timer = setTimeout(() => {
            if (os.platform() === "win32") {
                exec(`taskkill /pid ${child.pid} /f /t`, async (error) => {
                    if (error) {
                        console.error(`taskkill error: ${error}`);
                        reject("Error during killing process");
                        return;
                    }
                    console.log("Time Limit Exceeded")
                    const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
                    await submissions.create({ verdict: "Time Limit Exceeded", title: problem.title, user: user.email, solution: filepath, time: time });
                    out="Time Limit Exceeded"
                    resolve("Time Limit Exceeded");
                });
            } else {
                child.kill('SIGKILL');
                console.log(`Child process killed after ${timeLimit} milliseconds`);
                resolve("Time Limit Exceeded");
            }
        }, timeLimit);
          
        child.on('exit', async() => {
            clearTimeout(timer);
            console.log('Child process exited before the time limit');
          });
        //   if(out)
        //   resolve(out)
// }

    })
};

module.exports = {
    execute,
}