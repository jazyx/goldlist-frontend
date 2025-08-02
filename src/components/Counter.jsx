/**
 * frontend/src/components/Counter.jsx
 *
 * Shows a span with a backgroundColor between orange and
 * olive, if `count` is less than `target`, or green if
 * `count` is greater than or equal to target.
 */


export const Counter = ({
  count,
  total,
  target,
  icon,
  side
}) => {
  const style = { backgroundColor: "#040"}


  const green = 102
  if (count < target) {
    const step = (green / target )
    const red = Math.floor(255 - (step * count))
    style.backgroundColor = `rgb(${red}, ${green}, 0)`
  }


  const className = (side)
    ? `counter ${side}`
    : "counter"

  return (
    <div className={className}>
      <span
       className="counter"
       style={style}
      >
        {count}/{total}
      </span>
      <span className="icon">{icon}</span>
    </div>
  )
}