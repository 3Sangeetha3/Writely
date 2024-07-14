import React from 'react'
import { useAuth } from '../hooks';
import axios from "axios";

function Home() {
    //const { logout } = useAuth();
    async function getCurrentUser() {
       const result = await axios.get('http://localhost:3001/api/user');
       console.log('result', {result});
    }
  return (
        <div> 
            <h1>Home page</h1>
            <button onClick={() => getCurrentUser()}>logout</button>
        </div>
  )
}

export default Home
