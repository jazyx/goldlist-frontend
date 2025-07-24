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
  const [ userData, setUserData ] = useState({ userName: "Guest" })

  const getUserData = () => {
    console.log("getUserData")

    const url = `${origin}/getUserData`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(userData)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => {
        console.log("json", JSON.stringify(json, null, '  '));
        return json
      })
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