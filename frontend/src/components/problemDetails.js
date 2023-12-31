// import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
// // new
import Compiler from '../components/compiler'
import { useEffect, useState }from 'react'
import { Link, useParams } from 'react-router-dom'
// date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ProblemDetails = () => {
  const { id } = useParams();
  // const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

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
  const [problem, setproblem] = useState('')

  useEffect(() => {
    const fetchproblem = async () => {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/oj/`+id, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setproblem(json)
        // console.log(problem.statement)
        // dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    if (user) {
      fetchproblem()
    }
  }, [])

  return (
    <div className="workout-details">
      <h4>{problem.title}</h4>
      <pre><strong>Statement: </strong>{problem.statement}</pre>
      <Compiler key={problem._id} />
      {/* <p>{formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })}</p> */}
      {/* <span className="material-symbols-outlined" onClick={handleClick}>delete</span> */}
      {/* new */}
      {/* <span className="material-symbols-outlined"> <Link to={`/problems/${problem._id}`}>Link</Link></span> */}
    </div>
  )
}

export default ProblemDetails