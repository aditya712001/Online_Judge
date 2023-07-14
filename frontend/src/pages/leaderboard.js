import { useEffect, useState }from 'react'
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import axios from 'axios';

// components
// import WorkoutForm from '../components/WorkoutForm'
import { Link } from 'react-router-dom'
const Leaderboard = () => {
  // const {workouts, dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()
  const [submissions, setsubmissions] = useState('')

  useEffect(async() => {
    const fetchsubmissions = async () => {
      const response = await fetch('/api/oj', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setsubmissions(json)
      //   dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    if (user) {
      fetchsubmissions()
      const response = await axios.get(`http://localhost:3000/solutions/${submission._id}`, data)
    }
  }, [])

  const handleClick = async (id) => {
    if (!user) {
      return
    }

    const response = await fetch('/api/oj/solutions/' + id, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    
  }

  return (
    <div >
       <div className="workouts"> 
        {submissions && (submissions.map((submission) => 
          <div className="workout-details">
          <h4>{submission.title}{submission.verdict}{submission.user}</h4>
          <a href={`http://localhost:3000/solutions/${submission._id}`} target='_blank'>Code </a>
          </div>
        ))}
       </div>
    </div>
  )
}

export default Leaderboard