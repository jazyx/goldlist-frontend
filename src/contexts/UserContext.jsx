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
import storage from "../tools/storage"

// Initialize storage if it is empty
const INITIALIZED = (Object.entries(storage.settings).length)

if (!INITIALIZED) {
  storage.set({ user: { user_name: "User" }})
}


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { origin } = useContext(APIContext)

  // Read initial value of userData from LocalStorage
  const [ userData, setTheUserData ] = useState(
    () => storage.get()
  )


  const setUserData = (data) => {
    console.log("userData", JSON.stringify(data, null, '  '));

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = data.user.user_name.replace(/_.*/, "")
    storage.placeItems({ user: { user_name }})

    setTheUserData(data)
  }


  const editText = ({ _id, text }) => {

  }


  const editHint = ({ _id, hint }) => {

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


  const autoLoad = () => {
    if (INITIALIZED) {
      getUserData()
    }
  }

  // TODO: Stay on current rev page if that's where we are
  const goAdd = () => {
    if (userData.list) {
      navigate("/add")
    } else {
      navigate("/")
    }
  }


  useEffect(autoLoad, [])
  useEffect(goAdd, [userData.list])


  return (
    <UserContext.Provider
      value ={{
        userData,
        getUserData,
        editText,
        editHint
      }}
    >
      {children}
    </UserContext.Provider>
  )
}