import { useEffect, useState }from 'react'
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
// import WorkoutForm from '../components/WorkoutForm'
import { Link } from 'react-router-dom'
const Problems = () => {
  // const {workouts, dispatch} = useWorkoutsContext()
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
      //   dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    if (user) {
      fetchproblems()
    }
  }, [])

  return (
       <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
       <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
           <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
               <tr>
                   <th scope="col" class="px-6 py-3 text-xl">
                       Problem
                   </th>
                   <th scope="col" class="px-6 py-3 text-xl">
                       Link
                   </th>
               </tr>
           </thead>
           <tbody>
           {problems && problems.map((problem) => (
               <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                   <th scope="row" class="text-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                       {problem.title}
                   </th>
                   <td class="px-6 py-4">
                   <button><Link to={`/${problem._id}`}>Try</Link></button>
                       {/* <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Download</a> */}
                   </td>
               </tr>
           ))}
           </tbody>
       </table>
   </div>
  )
}

export default Problems