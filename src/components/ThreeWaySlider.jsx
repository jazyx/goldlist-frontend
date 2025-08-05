/**
 * frontend/src/components/ThreeWaySlider.jsx
 */


import { useState } from 'react'


export const ThreeWaySlider = ({ name, vertical, check }) => {
  const [ checked, setChecked ] = useState(check)
  
  name = name || "name"

  const onChange = ({ target }) => {
    const check = target.id.replace(`three-way-${name}-`, "")
    setChecked(check)
  }

  const className = (vertical)
    ? `three-way ${name} vertical`
    : `three-way ${name}`

  return (
    <div className={className}>
      <label>
        <input 
          type="radio" 
          name={name}
          id={`three-way-${name}-off`}
          className="off"
          checked={checked === "off" }
          onChange={onChange}
        />
      </label>
      <label>
        <input 
          type="radio" 
          name={name}
          id={`three-way-${name}-mid`}
          className="mid"
          checked={!checked || checked === "mid" }
          onChange={onChange}
        />
      </label>
      <label>
        <input 
          type="radio" 
          name={name} 
          id={`three-way-${name}-on`}
          className="on"
          checked={checked === "on" }
          onChange={onChange}
        />
      </label>
    </div>
  )
}