import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header className='sticky top-0 z-50'>
      <div className="container" >
        <Link to="/">
          <h1 className="text-4xl">Codeforces</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button><Link to="/">Problems</Link></button>
              <button><Link to="/submissions/solutions">Submissions</Link></button>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <button><Link to="/login">Login</Link></button>
              <button><Link to="/signup">Signup</Link></button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar