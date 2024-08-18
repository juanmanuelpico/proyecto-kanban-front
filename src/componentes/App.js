import Login from "./main/Login";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Register from "./main/Register.js";
import Home from "./main/Home.js";
import Body from "./main/BodyPrincipal";
import { UserProvider } from "./contexts/UserContext.js";
import EditProfile from "./user/EditProfile.js";

function App () {
  const isAuthenticated = localStorage.getItem("user");

  return (
    <UserProvider>
      <Router>
        <Routes>
        <Route path='*' element={<Navigate to='/login' replace />} />
          <Route path="/login" element={<Body><Login /></Body>} />
         
          <Route
            path="/register"
            element={isAuthenticated ? <Body><Register /> </Body> : <Navigate to="/login" />}
          />
           <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/editProfile"
            element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
          />
          
        </Routes>
      </Router>
    </UserProvider>
  )
  

}

export default App;