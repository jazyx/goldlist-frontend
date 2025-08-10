/**
 * frontend/src/components/ThreeWaySlider.jsx
 * 
 * Creates a div with three radio buttons, associated with the
 * states:
 * 
 * - "off"
 * - "mix"
 * - "on"
 * 
 * The initial state is set by the prop `check`. By default, the
 * value "mix" will be assumed.
 */


import { useState } from 'react'


export const ThreeWaySlider = ({
  name,
  check,    // "on" | "mix" (default) | "off" 
  action,
  vertical,
  title
}) => {
  const [ checked, setChecked ] = useState(check)
  
  name = name || "name"
  action = typeof action === "function" ? action : ()=>{}

  const onChange = ({ target }) => {
    const check = target.id.replace(`three-way-${name}-`, "")
    // Update default `checked` unless `action` is a function
    setChecked(check)
    action(check)
  }

  const className = (vertical)
    ? `three-way ${name} vertical`
    : `three-way ${name}`

  return (
    <div
      className={className}
      title={title}
    >
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
          id={`three-way-${name}-mix`}
          className="mix"
          checked={!checked || checked === "mix" }
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