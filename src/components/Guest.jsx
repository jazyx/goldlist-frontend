/**
 * frontend/src/components/Guest.jsx
 * 
 * Creates a Continue As Guest button. Clicking on this sends an
 * API call to /get_user_data. This returns a JSON object with
 * the user's name, start date and phrases from today.
 */


import React, { useContext} from 'react'
import { UserContext } from '../contexts/'

export const Guest = () => {
  const { userData, getUserData } = useContext(UserContext)
  const { user_name } = userData
  const shortName = user_name.replace(/_.*$/, "")

  return (
    <button
      onClick={getUserData}
    >
      Continue as {shortName}
    </button>
  )
}