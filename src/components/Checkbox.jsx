/**
 * frontend/src/components/Checkbox.jsx
 */


export const Checkbox = ({
  name      = "check",
  className = null,
  checked   = false,
  action    = () => {}
 }) => {


  return (
    <label>
      <input
        type="checkbox"
        name={name}
        className={className}
        checked={checked}
        onChange={action}
      />
      <span></span>
    </label>
  )
}