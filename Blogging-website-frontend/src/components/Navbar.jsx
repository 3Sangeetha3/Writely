import React from "react";
import { useAuth } from "../hooks";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const { isAuth, authUser } = useAuth();
    encodeURIComponent(authUser.username);


    //console.log("authUser", { isAuth, authUser });
    return (
        <nav className="navbar navbar-light navbar-custom">
            <div className="container">
                <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/" end>
                    Blogging App
                </NavLink>
                <ul className="nav navbar-nav pull-xs-right">
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/" end>
                            Home
                        </NavLink>
                    </li>
                    {isAuth && (
                        <>
                            <li className="nav-item">
                            <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/editor" end>
                                {/* <i className="ion-compose"/> */}
                                &nbsp;New Post
                            </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/settings" end>
                                    {/* <i className="ion-compose"/> */}
                                    &nbsp;Settings
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to={`/profile/${authUser?.username}`}>
                                    Hi {authUser?.username}
                                </NavLink>
                            </li>
                        </>
                    )}

                    {!isAuth && (
                        <>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/register" end>
                                    {/* <i className="ion-compose"/> */}
                                    SignUp
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? "navbar-brand active" : "navbar-brand"} to="/login" end>
                                    {/* <i className="ion-compose"/> */}
                                    Sign in
                                </NavLink>
                            </li>
                        </>
                    )}
   
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
