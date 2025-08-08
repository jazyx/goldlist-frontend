/**
 * frontend/contexts/APIContext.jsx
 */


import { createContext, useState, useEffect } from 'react'


const origins = [
  import.meta.env.VITE_LOCAL_ORIGIN,
  import.meta.env.VITE_LAN_ORIGIN
]
const local   = RegExp(import.meta.env.VITE_LOCAL)
const lan     = RegExp(import.meta.env.VITE_LAN)
const host    = location.host
const matches = [ local, lan ].map( regex => regex.test(host) )
const index   = matches.indexOf(true)

const origin = (index < 0)
  ? "" // Not running locally
  : origins[index]


export const APIContext = createContext()


export const APIProvider = ({ children }) => {
  const [ checked, setChecked ] = useState(false)
  const [ cookies, setCookies ] = useState(false)


  const checkForCookies = () => {
    if (checked) { return}

    const url = `${origin}/checkCookie`
    const options = {
      method: 'GET',
      credentials: 'include'
    }

    fetch(url, options)
      .then(incoming => incoming.text())
      .then(text => {
        try {
          const json = JSON.parse(text)
          return text
        } catch (error) {
          console.log("catch(error):", error)
          return Promise.reject(error)
        }
       })
      // .then(incoming => incoming.json())
      .then(json => treatCheckResponse(json))
      .catch(error => {
        console.log("error:", error)
      })
  }

  const treatCheckResponse = (json) => {
    const checked = document.cookie.indexOf("check=") > -1

    // Delete the cookie by setting its expiry date to the past
    document.cookie = "check=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    setCookies(checked)
    setChecked(true)
  }

  useEffect(checkForCookies, [])

  return (
    <APIContext.Provider
      value ={{
        origin,
        cookies
      }}
    >
      {children}
    </APIContext.Provider>
  )
}