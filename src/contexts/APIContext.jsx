/**
 * frontend/contexts/APIContext.jsx
 */


import { createContext } from 'react'

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

  return (
    <APIContext.Provider
      value ={{
        origin
      }}
    >
      {children}
    </APIContext.Provider>
  )
}