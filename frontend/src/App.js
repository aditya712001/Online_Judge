import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Problems from './pages/problems'
import ProblemDetails from './components/problemDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/leaderboard'
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
              path="/" 
              element={user ? <Leaderboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/problems" 
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
              path="/problems/:id" 
              element={user ? <ProblemDetails /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
