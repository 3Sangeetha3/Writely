import React from 'react'

const actions = {
    login: (user) => {
        console.log('login', {user})
    }
}
function useAuth() {
  return {
    ...actions 
  }
}

export default useAuth;
