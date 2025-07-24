/**
 * frontend/src/pages/Page1.jsx
 */


import React from 'react'
import { Guest } from '../components/Guest'


export const Home = (props) => {
  return (
    <main>
      <button disabled>Register</button>
      <button disabled>Log In</button>
      <Guest/>
    </main>
  )
}