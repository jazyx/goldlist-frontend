/**
 * frontend/src/components/GreenCircle.jsx
 */


import React from 'react'


export const GreenCircle = ({ disabled }) => {

  const className = `circle${disabled ? " disabled" : ""}`

  return (
    <div className={className}>
      🟢
    </div>
  )
}