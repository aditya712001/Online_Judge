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
      
    const timeLimit = 300; // time limit in milliseconds
    return new Promise((resolve, reject) => {
        let out=""
        const child=exec(
            // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${executable} < ${filePathtest} `,
            command,
            async(error, stdout, stderr) => {
                if (error) {
                    // submissions.create({verdict:"Error"+error,title:problem.title,user:user.email,solution:filepath})
                    console.log({ error, stderr })
                    reject({ error, stderr })
                    // stdout=error
                    // resolve(stdout);
                }
                if (stderr) {
                    console.log(stderr)
                    const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()
                    await submissions.create({verdict:"Compilation Error",title:problem.title,user:user.email,solution:filepath,time:time})
                    // stdout=stderr
                    reject(stderr)
                    // resolve(stdout)
                }

                else{
                    console.log(stdout)
                const solution = normalize(stdout)
                const expectedOutput = normalize(output)
                
                console.log(solution)
                console.log(expectedOutput)
                if(solution===expectedOutput)
                {
                    const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()
                    await submissions.create({verdict:"Accepted",title:problem.title,user:user.email,solution:filepath,time:time})
                    stdout="Accepted\n"+stdout
                }
                else
                {
                    const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()
                    stdout="Wrong Answer"
                    await submissions.create({verdict:"Wrong Answer",title:problem.title,user:user.email,solution:filepath,time:time})
                }
                // console.log(stdout)
                resolve(stdout);
            }
            }  
        )
        // Kill the child process after the time limit is exceeded
        const timer = setTimeout(() => {
            exec(`taskkill /pid ${child.pid} /f /t`, (error, stdout, stderr) => {
              if (error) {
                console.error(`taskkill error: ${error}`);
                return;
              }
          
              console.log(`Child process killed after ${timeLimit} milliseconds`);
              console.log(`stdout: ${stdout}`);
              stdout="Time Limit Excedded"
              out="Time Limit Excedded"
              console.error(`stderr: ${stderr}`);
            });
          }, timeLimit);
          
          child.on('exit', () => {
            clearTimeout(timer);
            console.log('Child process exited before the time limit');
          });
          if(out)
          resolve(stdout)
    })
};

module.exports = {
    execute,
}