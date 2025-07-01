import React from "react";
import { json } from "react-router-dom";
import { proxy, useSnapshot, snapshot } from "valtio";
import axios from "axios";
import { isEmpty } from 'lodash-es';


function getAuthUser() {
  const jwt = window.localStorage.getItem("jwtToken");

  if (!jwt) return {};
  try {
    return JSON.parse(atob(jwt));
  } catch (error) {
    console.error("Invalid JWT token:", error);
    window.localStorage.removeItem("jwtToken");
    return {};
  }
}
//proxy object
const state = proxy({
  authUser: getAuthUser(),
});

const isAuth = snapshot(state);
const actions = {
  login: (user) => {
    // console.log('useAuth.js - login action called with user:', user);
    state.authUser = user;
    const b64EncodedUser = btoa(JSON.stringify(state.authUser));
    // console.log('useAuth.js - Encoded user for localStorage:', b64EncodedUser);
    window.localStorage.setItem("jwtToken", b64EncodedUser);
    if (state.authUser.token) {
        axios.defaults.headers.Authorization = `Token ${state.authUser.token}`;
        // console.log('useAuth.js - axios Authorization header set to:', axios.defaults.headers.Authorization);
    } else {
        console.warn('useAuth.js - state.authUser.token is missing after login:', state.authUser);
    }
  },
  logout: () => {
    state.authUser = {};
    window.localStorage.removeItem("jwtToken");
  },
};

function useAuth() {
  const snap = useSnapshot(state);
  //console.log('snap: ', {snap});

  const getAuthStatus = () => !isEmpty(snap.authUser);
  return {
    ...snap,
    ...actions,
    isAuth:getAuthStatus()
  };
}

export default useAuth;