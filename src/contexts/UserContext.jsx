/**
 * frontend/src/contexts/UserContext.jsx
 *
 * description
 */


import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { APIContext } from "./APIContext"


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const { origin } = useContext(APIContext)
  const [ userData, setTheUserData ] = useState({ user_name: "Guest" })


  const setUserData = (data) => {
    console.log("userData", JSON.stringify(data, null, '  '));
    setTheUserData(data)
  }


  const getUserData = () => {
    const url = `${origin}/getUserData`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(userData)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => setUserData(json))
      .catch(error => setUserData(error.message))
  }


  return (
    <UserContext.Provider
      value ={{
        userData,
        getUserData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}