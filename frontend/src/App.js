import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Problems from './pages/problemtable'
import ProblemDetails from './components/prblmdetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/leadertable'
import Navbar from './components/Navbar'
// new
// import WorkoutFormEdit from './components/WorkoutFormEdit'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
          <Route 
              path="/submissions/solutions" 
              element={user ? <Leaderboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={user ? <Problems /> : <Navigate to="/login" /> }
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
              path="/:id" 
              element={user ? <ProblemDetails /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
