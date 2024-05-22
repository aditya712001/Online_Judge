const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();
const stream = require('stream');

const problems = require('./models/problemsmodel');
const mongoose = require('mongoose');
const submissions = require('./models/submissionsmodel');
const User = require('./models/userModel');

const compileAndRun = async (language, filepath, id, user_id) => {
  const problem = await problems.findById(id);
  const user = await User.findById(user_id);
//   console.log(problem)
  const filePathtest = problem.ip; // Your input string
  const filePathtestop = problem.op;
  const timeLimit = 2000; // 5 seconds in milliseconds
  
  let output = '';
  fs.readFile(filePathtestop, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    console.log('File content:', data);
    output = data;
  });

  const jobId = path.basename(filepath).split('.')[0];
  let executable = jobId;
  let compileCommand = '';
  let runCommand = '';
  if (os.platform() === 'linux') executable += '.out';
  else executable += '.exe';

  const outputPath = path.join(__dirname, 'outputs', executable);

  const normalize = (text) => {
    text = text.replace(/(\r\n|\n|\r)/gm, '\n');
    return text.trim();
  };

  if (language === 'cpp' || language === 'c') {
    compileCommand = `g++ ${filepath} -o ${outputPath}`;
    runCommand = `${outputPath} < ${filePathtest}`;

    return new Promise((resolve, reject) => {
      const container = docker.container.create({
        Image: 'gcc', // Assuming you have the GCC image available
        Tty: true,
        AttachStdout: true,
        AttachStderr: true,
      });

      container.exec(
        {
          Cmd: ['/bin/sh', '-c', compileCommand],
        },
        async (err, exec) => {
          if (err) {
            console.error('Error creating exec instance:', err);
            return;
          }

          exec.start(async (err, stream) => {
            if (err) {
              console.error('Error starting exec stream:', err);
              return;
            }

            exec.inspect(async (err, data) => {
              if (err) {
                console.error('Error inspecting exec:', err);
                return;
              }

              if (data.ExitCode !== 0) {
                const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                await submissions.create({
                  verdict: 'Compilation Error',
                  title: problem.title,
                  user: user.email,
                  solution: filepath,
                  time: time,
                });
                console.log('Compilation Error');
                resolve('Compilation Error:\n' + data.Stderr + '\nDuration: 0 ms');
                return;
              }

              const start = Date.now();
              const runContainer = docker.container.create({
                Image: 'gcc', // Assuming you have the GCC image available
                Tty: true,
                AttachStdout: true,
                AttachStderr: true,
              });

              runContainer.exec(
                {
                  Cmd: ['/bin/sh', '-c', runCommand],
                },
                async (err, runExec) => {
                  if (err) {
                    console.error('Error creating exec instance for run:', err);
                    return;
                  }

                  runExec.start(async (err, runStream) => {
                    if (err) {
                      console.error('Error starting exec stream for run:', err);
                      return;
                    }

                    runExec.inspect(async (err, runData) => {
                      const duration = Date.now() - start;
                      console.log(duration);

                      if (duration >= timeLimit) {
                        const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                        await submissions.create({
                          verdict: 'Time Limit Exceeded',
                          title: problem.title,
                          user: user.email,
                          solution: filepath,
                          time: time,
                        });
                        console.log('Time Limit Exceeded');
                        resolve('Time Limit Exceeded');
                        return;
                      } else if (runData.ExitCode !== 0) {
                        const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                        await submissions.create({
                          verdict: 'Runtime Error',
                          title: problem.title,
                          user: user.email,
                          solution: filepath,
                          time: time,
                        });
                        console.log('Runtime Error');
                        resolve('Runtime Error:\n' + runData.Stderr);
                        return;
                      }

                      const actualOutput = normalize(runData.Stdout);
                      const expectedOutput = normalize(output);
                      console.log(actualOutput);

                      if (actualOutput === expectedOutput) {
                        const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                        await submissions.create({
                          verdict: 'Accepted',
                          title: problem.title,
                          user: user.email,
                          solution: filepath,
                          time: time,
                        });
                        console.log('Accepted');
                        resolve('Accepted');
                      } else {
                        const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                        await submissions.create({
                          verdict: 'Wrong Answer',
                          title: problem.title,
                          user: user.email,
                          solution: filepath,
                          time: time,
                        });
                        console.log('Wrong Answer');
                        resolve('Wrong Answer');
                      }
                    });
                  });
                }
              );
            });
          });
        }
      );
    });
  } else if (language === 'py') {
    runCommand = `python3 ${filepath} < ${filePathtest}`;

    return new Promise(async(resolve, reject) => {
      // Inside the block where you create the container for compilation
// const compilationContainer = await docker.createContainer({
//     Image: 'python:3', // Assuming you have the GCC image available
//     Tty: true,
//     AttachStdout: true,
//     AttachStderr: true,
//   });
  
//   // Start the compilation container
//   await compilationContainer.start();
  
//   // Use the exec method on the compilation container to run the compileCommand
//   const compilationExec = await compilationContainer.exec({
//     Cmd: ['/bin/sh', '-c', compileCommand],
//     AttachStdout: true,
//     AttachStderr: true,
//   });
  
//   // Start the exec instance
//   const compilationStream = await compilationExec.start();
  
//   // Listen for events or read from the stream as needed
  
//   // When the compilation is done, proceed with other steps, including starting a new container for running the code
//   const compilationData = await compilationExec.inspect();
//   if (compilationData.ExitCode !== 0) {
//     const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
//     await submissions.create({
//       verdict: 'Compilation Error',
//       title: problem.title,
//       user: user.email,
//       solution: filepath,
//       time: time,
//     });
//     console.log('Compilation Error');
//     resolve('Compilation Error:\n' + compilationData.Stderr + '\nDuration: 0 ms');
//     return;
//   }
  
  const start = Date.now();

  // Create a new container for running the code
  const runContainer = await docker.createContainer({
    Image: 'python:3', // Update this to the appropriate image for running the code
    Tty: true,
    AttachStdout: true,
    AttachStderr: true,
  });

  runContainer.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
    stream.pipe(process.stdout);
  });
    
  // Start the compilation container
  await runContainer.start();
  
  // Use the exec method on the run container to execute the runCommand
  const runExec = await runContainer.exec({
    Cmd: ['/bin/sh', '-c', runCommand],
  });
  
  // Start the exec instance
  const runStream = await runExec.start()
//   });
//   // Listen for events or read from the stream as needed
//   runExec.inspect(async (err, runData) => {
//     const duration = Date.now() - start;
//     console.log(duration);
  
    // if (duration >= timeLimit) {
    //   const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    //   await submissions.create({
    //     verdict: 'Time Limit Exceeded',
    //     title: problem.title,
    //     user: user.email,
    //     solution: filepath,
    //     time: time,
    //   });
    //   console.log('Time Limit Exceeded');
    //   resolve('Time Limit Exceeded');
    //   return;
    // } else 
    // if (runData.ExitCode !== 0) {
    //   const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    //   await submissions.create({
    //     verdict: 'Runtime Error',
    //     title: problem.title,
    //     user: user.email,
    //     solution: filepath,
    //     time: time,
    //   });
    //   console.log('Runtime Error');
    //   resolve('Runtime Error:\n' + runData.Stderr);
    //   return;
    // }
// ...

// Create a writable stream to capture the output
const outputChunks = [];
const outputCaptureStream = new stream.Writable({
  write(chunk, encoding, callback) {
    outputChunks.push(chunk);
    callback();
  },
});

// Pipe the runStream to the outputCaptureStream
runStream.pipe(outputCaptureStream);

// Wait for the 'finish' event to know when the stream has finished
await new Promise((resolve) => {
  outputCaptureStream.on('finish', resolve);
});

// Convert the captured chunks to a string (the output)
const runOutput = Buffer.concat(outputChunks).toString('utf-8');

// Rest of your code

const duration = Date.now() - start;
console.log(duration);

// Rest of your code


  const actualOutput = process.stdout;
    // const actualOutput = runData.Stdout;
    const expectedOutput = normalize(output);
    console.log(process.stdout);
  
    if (actualOutput === expectedOutput) {
      const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
      await submissions.create({
        verdict: 'Accepted',
        title: problem.title,
        user: user.email,
        solution: filepath,
        time: time,
      });
      console.log('Accepted');
      resolve('Accepted');
    } else {
      const time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
      await submissions.create({
        verdict: 'Wrong Answer',
        title: problem.title,
        user: user.email,
        solution: filepath,
        time: time,
      });
      console.log('Wrong Answer');
      resolve('Wrong Answer');
    }
  });
  
  
}
}
module.exports = {
  compileAndRun,
};
