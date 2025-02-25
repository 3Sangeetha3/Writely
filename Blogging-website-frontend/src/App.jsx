import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Article, Auth, Editor, Home, Settings, Profile } from "./pages";
import axios from "axios";
import { Navbar } from "./components";
import { AuthRoute, GuestRoute } from "./components";
import VerifyEmail from "./pages/VerifyEmail";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";

function App() {
  useEffect(() => {

    const jwt = window.localStorage.getItem('jwtToken');

    if(!jwt) return ;

    const parsedJwt = JSON.parse(atob(jwt));
    //console.log('parsedJwt',{parsedJwt})
    axios.defaults.headers.Authorization = `Token ${parsedJwt.token}`;

  }, []);
  return (
    <Router>
      <div>
        <header>
          <Navbar/>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<GuestRoute />}>
              <Route path="/register" element={<Auth key="register" />} />
            </Route>

            {/* <GuestRoute path='/register' element={<h1>Register </h1>} /> */}
            <Route path="/login" element={<GuestRoute />}>
              <Route path="/login" element={<Auth key="login" />} />
            </Route>
            {/* <Route path='/login' element={<h1>Login </h1>} /> */}
            <Route path="/settings" element={<AuthRoute />}>
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/editor" element={<AuthRoute />}>
              <Route path="/editor" element={<Editor />} />
            </Route>
            <Route path="/editor/:slug" element={<h1>Editor </h1>} />
            <Route path="/article/:slug" element={<Article/>} />
            {/* <Route path="/profile/:username" element={<Profile />} /> */}
            <Route path="/profile" element={<AuthRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
              <Route path="/profile/:username" element={<UserProfile/>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right" 
          containerStyle={{ marginTop: "4rem" }} 
        />
      </div>
    </Router>
  );
}

export default App;
