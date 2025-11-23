import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/Notfound"
import WelcomePage from "./Components/WelcomePages/Home";
import LogInPage from "./Components/WelcomePages/Loginpage";
import SignUpPage from "./Components/Pages/auth/Signup";

import RestaurantDashboard from "./Components/restaurent/RestaurentDashbaord";
import IgifuDashboard from "./Components/Student/Dashboard/IgifuDashboardMainApp";
function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Auth Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
<Route path="/restaurentdashboard" element={<RestaurantDashboard/>}></Route>
        {/* ✅ Meal and Wallet Pages */}
  
        <Route path="/igifu-dashboard" element={<IgifuDashboard />} />

        {/* ✅ Restaurant & Favourites */}
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
