import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'
import { useParams, Link, redirect } from 'react-router-dom'

const Compiler=()=> {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [language, setlanguage] = useState('cpp')
  const { id } = useParams()
  const { user } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      // language: 'cpp',
      language,code
    }

    try {
        // if (!user) {
        //     setError('You must be logged in')
        //     return
        //   }
        if(user)
        {
          const response = await fetch(`${process.env.REACT_APP_URL}/api/oj/`+ id, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          })
          const data = await response.json()
      
    //   const { data } = await axios.post('http://localhost:5000/run', payload);
      console.log(data)
      if(data.output)
      setOutput(data.output)
      else
      setOutput(data.error)
        }
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div >
          {/* <h1>AlgoU Online Code Compiler</h1> */}
      <br />
      <select value={language} onChange={(e) => {
        setlanguage(e.target.value);
      }}className="select-box">
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        {/* <option value='java'>Java</option> */}
      </select>
      {/* <br /> */}
      <textarea rows='20' cols='75' placeholder='Write your Code' value={code} onChange={(e) => {
        setCode(e.target.value);
      }}></textarea>
      <br />
      <button onClick={handleSubmit}>
        Submit
      </button>
      {output &&
        <div >
        <br/>
          <pre wrap="True">{output}</pre>
        </div>
      }
     </div>
  )
}

export default Compiler;