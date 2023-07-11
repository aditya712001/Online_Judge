import { useEffect, useState }from 'react'
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
// import { useAuthContext } from "../hooks/useAuthContext"

// components
// import WorkoutForm from '../components/WorkoutForm'
import { Link } from 'react-router-dom'
const Problems = () => {
  // const {workouts, dispatch} = useWorkoutsContext()
  // const {user} = useAuthContext()
  const [problems, setproblems] = useState('')

  useEffect(() => {
    const fetchproblems = async () => {
      const response = await fetch('/api/problems', {
        // headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setproblems(json)
      //   dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    // if (user) {
      fetchproblems()
    // }
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
       {/*   <WorkoutForm />  */}
       </div>
  )
}

export default Problems