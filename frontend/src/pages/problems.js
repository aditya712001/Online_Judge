import { useEffect, useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"

import { Link } from 'react-router-dom'
const Problems = () => {
  const {user} = useAuthContext()
  const [problems, setproblems] = useState('')

  useEffect(() => {
    const fetchproblems = async () => {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/oj/`, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setproblems(json)
      }
    }

    if (user) {
      fetchproblems()
    }
  }, [])

  return (
    <div >
       <div className="workouts"> 
        {problems && problems.map((problem) => (
          <div className="workout-details">
          <h4>{problem.title}</h4>
          <span className="material-symbols-outlined"> <Link to={`/${problem._id}`}>Link</Link></span>
        </div>
        ))}
       </div>
       </div>
  )
}

export default Problems