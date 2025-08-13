/**
 * frontend/src/components/StepSlider.jsx
 * 
 * Shows a slider with a range of 0 to max(values). The slider
 * can only stop at certain levels. As it is dragged, it will
 * jump to the next available position.
 */


import React from 'react'


export const StepSlider = (props) => {
  const { values, value, name, label, treatValue } = props

  const max = values.length - 1

  const guess = values[max] // values[Math.floor(max / 2)]
  const nearest = values.reduce(( data, candidate ) => {
    const gap = Math.abs(value - candidate)
    if (gap < data.delta) {
      data.optimal = candidate
      data.delta = gap
    }
    return data

  }, { optimal: guess, delta: Infinity }).optimal
  
  const step = values.indexOf(nearest)


  const onInput = ({ target }) => {
    const { name, value: index } = target
    const value = values[index]
    treatValue( name, value )
  }


  const sliderClass = "step-slider"
   + ((typeof name === "string")
        ? ` ${name}`
        : ""
     )


  return (
    <label
       className={sliderClass}
    >
      <div className="range-value">
        <input
          type="range"
          name={name}
          max={max}
          value={step}
          onInput={onInput}
        />
        <span className="value">{value}</span>
      </div>
      <span className="label">{label}</span>
    </label>
  )
}