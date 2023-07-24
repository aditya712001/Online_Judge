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
      const response = await fetch('/api/oj/problems/'+id, {
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

    // <div className="bg-white py-24 sm:py-32">
    //   <div className="mx-auto max-w-7xl px-6 lg:px-8">
    //     {/* <div className="mx-auto max-w-2xl lg:mx-0">
    //       <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
    //       <p className="mt-2 text-lg leading-8 text-gray-600">
    //         Learn how to grow your business with our expert advice.
    //       </p>
    //     </div> */}
    //     <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
    //       {/* {posts.map((post) => ( */}
    //         {/* <article key={post.id} className="flex max-w-xl flex-col items-start justify-between"> */}
    //           {/* <div className="flex items-center gap-x-4 text-xs"> */}
    //             {/* <time dateTime={post.datetime} className="text-gray-500">
    //               {post.date}
    //             </time>
    //             <a
    //               href={post.category.href}
    //               className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
    //             > */}
    //               {/* {post.category.title}
    //             </a>
    //           </div> */}
    //           <div className="group relative">
    //             <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
    //               {/* <a href={post.href}> */}
    //                 <span className="absolute inset-0" />
    //                 {problem.title}
    //               {/* </a> */}
    //             </h3>
    //             <pre className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{problem.statement}</pre>
    //           </div>
    //           {/* <div className="relative mt-8 flex items-center gap-x-4">
    //             <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
    //             <div className="text-sm leading-6">
    //               <p className="font-semibold text-gray-900">
    //                 <a href={post.author.href}>
    //                   <span className="absolute inset-0" />
    //                   {post.author.name}
    //                 </a>
    //               </p>
    //               <p className="text-gray-600">{post.author.role}</p>
    //             </div>
    //           </div> */}
    //         {/* </article> */}
    //       {/* ))} */}
    //     </div>
    //   </div>
    // </div>
    // <div className="question">
    //   <main className="input" >
        
    //     <h1 style={{color : "red"}}>Problem</h1>
    //     <pre>{problem.statement}</pre>

    //   </main>
    // </div>
  )
}

export default ProblemDetails