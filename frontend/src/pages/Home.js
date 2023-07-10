import { useEffect, useState }from 'react'
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
// import { useAuthContext } from "../hooks/useAuthContext"

// components
import problemsDetails from '../components/problemsDetails'
// import WorkoutForm from '../components/WorkoutForm'

const Home = () => {
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
  }, [problems, setproblems])

  return (
    <div className="home">
      <div className="workouts">
        {problems && problems.map((problem) => (
          // <p>{problem.title}</p>
          <problemsDetails key={problem._id} problem={problem} />
        ))}
      </div>
      {/* <WorkoutForm /> */}
    </div>
  )
}

export default Home