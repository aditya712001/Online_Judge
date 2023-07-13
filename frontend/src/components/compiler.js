import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'
import { useParams } from 'react-router-dom'

function Compiler() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const { id } = useParams();
  const { user } = useAuthContext()

  const handleSubmit = async () => {
    const payload = {
      language: 'cpp',
      code
    };

    try {
        // if (!user) {
        //     setError('You must be logged in')
        //     return
        //   }
        if(user)
        {
          const response = await fetch('/api/problems/'+ id, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          })
          const data = await response.json()
      
    //   const { data } = await axios.post('http://localhost:5000/run', payload);
      console.log(data);
      setOutput(data.output);
        }
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div >
          {/* <h1>AlgoU Online Code Compiler</h1> */}
      {/* <select className="select-box">
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        <option value='java'>Java</option>
      </select>
      <br /> */}
      <textarea rows='20' cols='75' value={code} onChange={(e) => {
        setCode(e.target.value);
      }}></textarea>
      <br />
      <button onClick={handleSubmit}>
        Submit
      </button>
      {output &&
        <div >
          <p>{output}</p>
        </div>
      }
     </div>
  );
}

export default Compiler;