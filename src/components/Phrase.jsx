/**
 * frontend/src/components/Phrase.jsx
 */


import React from 'react'


export const Phrase = ({ text, hint }) => {


  return (
    <h1>{text} | {hint}</h1>
  )
}