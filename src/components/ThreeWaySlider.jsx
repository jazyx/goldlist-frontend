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



export const ThreeWaySlider = ({
  name,
  check,    // "on" | "mix" (default) | "off" 
  action,
  vertical,
  title,
  disabled
}) => {
  
  name = name || "name"
  // action should update the value of check upstream; fallback
  action = typeof action === "function" ? action : ()=>{}

  const onChange = ({ target }) => {
    const check = target.id.replace(`three-way-${name}-`, "")
    action(name, check)
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
          checked={check === "off" }
          onChange={onChange}
          disabled={disabled === "off"}
        />
      </label>
      <label>
        <input 
          type="radio" 
          name={name}
          id={`three-way-${name}-mix`}
          className="mix"
          checked={!check || check === "mix" }
          onChange={onChange}
          disabled={disabled === "mix"}
        />
      </label>
      <label>
        <input 
          type="radio" 
          name={name} 
          id={`three-way-${name}-on`}
          className="on"
          checked={check === "on" }
          onChange={onChange}
          disabled={disabled === "on"}
        />
      </label>
    </div>
  )
}