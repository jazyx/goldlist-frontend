/**
 * frontend/src/components/CheckSlider.jsx
 */


export const CheckSlider = ({
  name      = "check",
  className = null,
  checked   = false,
  action    = () => {}
 }) => {


  return (
    <label className="checkSlider">
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