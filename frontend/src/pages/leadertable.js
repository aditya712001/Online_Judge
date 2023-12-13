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
      const response = await fetch(`${process.env.REACT_APP_URL}/api/oj/submissions/solutions`, {
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
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="text-xl px-6 py-3">
                    Problem
                </th>
                <th scope="col" class="text-xl px-6 py-3">
                    Verdict
                </th>
                <th scope="col" class="text-xl px-6 py-3">
                    User
                </th>
                <th scope="col" class="text-xl px-6 py-3">
                    Submitted At
                </th>
                <th scope="col" class="text-xl px-6 py-3">
                    Code
                </th>
            </tr>
        </thead>
        <tbody>
        {submissions && submissions.map((submission) =>( 
        <>
            <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" class="text-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {submission.title}
                </th>
                <td class="text-lg px-6 py-4">
                    {submission.verdict}
                </td>
                <td class="text-lg px-6 py-4">
                    {submission.user}
                </td>
                <td class="text-lg px-6 py-4">
                    {submission.time}
                </td>
                <td class="px-6 py-4">
                <button onClick={async() => {
    if (!user) {
      return
    }
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_URL}/api/oj/submissions/solutions/` + submission._id,
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
    
  }}>Download</button>
                    {/* <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Download</a> */}
                </td>
            </tr>
        </>
        ))}
        </tbody>
    </table>
</div>

  )
}

export default Leaderboard
