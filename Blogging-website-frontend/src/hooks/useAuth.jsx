import React from 'react'
import { json } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';
import { proxyWithComputed } from 'valtio/utils';

function getAuthUser() {
    const jwt = window.localStorage.getItem('jwtToken');

    if(!jwt) return {};
    return JSON.parse(atob(jwt));
}
//proxy object
const state = proxy (
    {
        authUser: getAuthUser(),
    },
    {
        isAuth: true
    }
);


const actions = {
    login: (user) => {
        console.log('login', {user, state});
        state.authUser = user;
        window.localStorage.setItem('jwtToken', btoa(JSON.stringify(state.authUser)))
    },
    logout: ()  => {
        state.authUser = {};
        window.localStorage.removeItem('jwtToken');
    
    }
}


function useAuth() {
    const snap = useSnapshot(state);
    console.log('snap: ', {snap});
    return {
        ...snap,
        ...actions
    }
}

export default useAuth;
