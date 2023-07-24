import { useEffect, useState }from 'react'
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import axios from 'axios'
// components
// import WorkoutForm from '../components/WorkoutForm'
const Leaderboard = () => {
  // const {workouts, dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()
  const [submissions, setsubmissions] = useState('')

  useEffect(() => {
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
    }
  }, [])

  return (
    <div>
       <div className="workouts"> 
        {submissions && submissions.map((submission) =>( 
          <div className="workout-details">
          <pre className='leaderboard'>{submission.title}      {submission.verdict}      {submission.user}       {submission.createdAt}       <button onClick={async() => {
    if (!user) {
      return
    }
    axios({
      method: 'get',
      url: 'http://localhost:3000/api/oj/solutions/' + submission._id,
      responseType: 'blob',
      headers: {
            'Authorization': `Bearer ${user.token}`
          }
      })
      .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', submission.title);
          document.body.appendChild(link);
          link.click();
      })
      .catch((error) => {
          alert(error);
      })
    
  }}>Download Code</button> </pre>
          
          {/* <a href={`http://localhost:3000/solutions/${submission._id}`} target='_blank'>Code </a> */}
          </div>
        ))}
       </div>
    </div>
  )
}

export default Leaderboard