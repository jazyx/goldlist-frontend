/**
 * frontend/src/contexts/index.js
 */


import { APIProvider, APIContext } from "./APIContext"
import { UserProvider, UserContext } from "./UserContext"


const Provider = ({ children }) => {
  return (
    <APIProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </APIProvider>
  )
}


export {
  Provider,
  APIContext,
  UserContext
}