/**
 * frontend/src/contexts/UserContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { useNavigate } from 'react-router-dom'
import { APIContext } from "./APIContext"


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { origin } = useContext(APIContext)
  const [ userData, setTheUserData ] = useState({ 
    user: { user_name: "User" }
  })


  const setUserData = (data) => {
    console.log("userData", JSON.stringify(data, null, '  '));
    setTheUserData(data)
  }


  const getUserData = () => {
    const url = `${origin}/getUserData`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(userData.user)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => setUserData(json))
      .catch(error => setUserData(error.message))
  }


  const goAdd = () => {
    if (userData.list) {
      navigate("/add")
    }
  }


  useEffect(goAdd, [userData.list])


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