/**
 * frontend/src/components/CheckSlider.jsx
 */


export const CheckSlider = ({
  name      = "check",
  className = null,
  checked   = false,
  action    = () => {},
  title     = "",
  vertical  = false
 }) => {

  if (vertical) {
    className = (className)
      ? `${className} vertical`
      : "vertical"
  }


  return (
    <label
      className="checkSlider"
      title={title}
    >
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