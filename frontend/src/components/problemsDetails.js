// import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
// import { useAuthContext } from '../hooks/useAuthContext'
// // new
// import WorkoutFormEdit from '../components/WorkoutFormEdit'
import { Link } from 'react-router-dom'
// date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const problemsDetails = ({ problem }) => {
  // const { dispatch } = useWorkoutsContext()
  // const { user } = useAuthContext()

  // const handleClick = async () => {
  //   if (!user) {
  //     return
  //   }

  //   const response = await fetch('/api/workouts/' + workout._id, {
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': `Bearer ${user.token}`
  //     }
  //   })
  //   const json = await response.json()

  //   if (response.ok) {
  //     dispatch({type: 'DELETE_WORKOUT', payload: json})
  //   }
  // }

  return (
    <div className="workout-details">
      <h4>{problem.title}</h4>
      <p><strong>Statement: </strong>{problem.statement}</p>
      {/* <p><strong>Reps: </strong>{workout.reps}</p> */}
      {/* <p>{formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}</p> */}
      {/* <span className="material-symbols-outlined" onClick={handleClick}>delete</span> */}
      {/* new */}
      {/* <span className="material-symbols-outlined"> <Link to={`/problems/${problem._id}`}>link</Link></span> */}
    </div>
  )
}

export default problemsDetails