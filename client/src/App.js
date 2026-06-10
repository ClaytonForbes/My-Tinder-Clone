import Home from './pages/Home'
import Dashboard from './pages/DashBoard'
import Onboarding from './pages/Onboarding'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element ={<Home/>}/>
      <Route path="/dashboard" element ={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path="/onboarding" element ={<Onboarding/>}/>
    </Routes>
    </BrowserRouter>
 
    
  );
}

export default App;
