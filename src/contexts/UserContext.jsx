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

const LIST_LENGTH = 21
// Initialize storage if it is empty
const INITIALIZED = (Object.entries(storage.settings).length)

if (!INITIALIZED) {
  storage.set({ user_name: "User" })
}


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { origin } = useContext(APIContext)

  // Read initial value of userData from LocalStorage
  const [ user, setUser ] = useState(() => storage.get())
  const [ list, setList ] = useState({})
  const [ phrases, setPhrases ] = useState([])
  const [ redos, setRedos ] = useState([])


  const treatUserData = (data) => {
    // console.log("userData", JSON.stringify(data, null, '  '));

    const { user, list, redos } = data

    const phrases  = list.phrases.map( phrase => {
      const { text, hint } = phrase
      const db = { text, hint }
      return { ...phrase, db, saving }
    })
    while (phrases.length < LIST_LENGTH) {
      phrases.push({
        _id: phrases.length,
        text: "",
        hint: "",
        db: { text: "", hint: "" },
      })
    }
    // console.log("phrases", JSON.stringify(phrases, null, '  '));

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = user.user_name.replace(/_.*/, "")
    storage.placeItems({ user: { user_name }})

    setUser(user)
    setList(list)
    setPhrases(phrases)
    setRedos(redos)
  }


  const editPhrase = ({ name, _id, value }) => {
    console.log("name:", name, _id, value)
    const phrase = phrases.find(
      phrase => phrase._id === _id
    )
    phrase[name] = value
    setList({...list})
  }


  const getUserData = () => {
    const url = `${origin}/getUserData`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(user)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatUserData(json))
      .catch(treatDataError)
  }


  const treatDataError = error => {
    console.log(error.message)
  }


  const autoLoad = () => {
    if (INITIALIZED) {
      getUserData()
    }
  }

  // TODO: Stay on current rev page if that's where we are
  const goAdd = () => {
    if (list.phrases) {
      navigate("/add")
    } else {
      navigate("/")
    }
  }


  useEffect(autoLoad, [])
  useEffect(goAdd, [list])


  return (
    <UserContext.Provider
      value ={{
        user,
        list,
        phrases,
        redos,
        getUserData,
        editPhrase
      }}
    >
      {children}
    </UserContext.Provider>
  )
}