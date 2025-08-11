/**
 * frontend/src/contexts/index.js
 */


import { APIProvider, APIContext } from "./APIContext"
import { I18nProvider, I18nContext } from "./I18nContext"
import { UserProvider, UserContext } from "./UserContext"


const Provider = ({ children }) => {
  return (
    <APIProvider>
      <I18nProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </I18nProvider>
    </APIProvider>
  )
}


export {
  Provider,
  APIContext,
  I18nContext,
  UserContext
}