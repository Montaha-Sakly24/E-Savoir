import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./Pages/public/Home";
import Login from "./Pages/public/Login";
import Signup from "./Pages/public/Signup";
import MemberRoutes from "./routes/MemberRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";



function App() {


  return (
    <>
     <BrowserRouter>
        <Routes>
          
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes membres */}
          <Route element={<ProtectedRoute role="MEMBER" />}>
              <Route path="/member/*" element={<MemberRoutes />} />
          </Route>
  

          {/* Route 404 */}
          <Route path="*" element={<div>Page non trouvée</div>} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
