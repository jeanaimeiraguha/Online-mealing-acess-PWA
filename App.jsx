import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/Notfound"
import WelcomePage from "./Components/WelcomePages/Home";
import LogInPage from "./Components/WelcomePages/Loginpage";
// import SignUpPage from "./Components/WelcomePages/Signup";
import SignUpPage from "./Components/Pages/auth/Signup";

import RestaurantDashboard from "./Components/restaurent/RestaurentDashbaord";
import MealWalletApphome from "./Components/WelcomePages/Home8";
import MealPage from "./Components/WelcomePages/MealPage";
import MealWalletpage10 from "./Components/WelcomePages/page10";
import MealWalletpage14 from "./Components/WelcomePages/Page14";
import MealWallet14 from "./Components/WelcomePages/page14b";
import MealWallet14d from "./Components/WelcomePages/page14d";
import IgifuDashboard from "./Components/Student/MealCard";
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
        
    

        {/* ✅ Student  Home Pages */}
       
        
    
        {/* <Route path="/wallet14d" element={<MealWallet14d />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
