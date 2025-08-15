/**
 * frontend/src/components/StepSlider.jsx
 *
 * Shows a slider with a range of 0 to max(values). The slider
 * can only stop at certain levels. As it is dragged, it will
 * jump to the next available position. The value cannot be less
 * than the smallest of the values, so the accent-color should
 * indicate that it won't get smaller.
 */


import { useRef } from 'react'


export const StepSlider = (props) => {
  const {
    name,
    value,
    values, // [ 1, 2, 3, 5, 7, 10 ,14 ] || [ 10, 15, 21 ]
    labels, // [ "after one day", ..., "21 a day"]
    treatValue
  } = props

  const sliderRef = useRef()

  const current = snapToNearest(value || 9999)
  const max = Math.max.apply(null, values)
  const min = Math.min.apply(null, values)


  function snapToNearest (current) {
    return values.reduce(( data, value ) => {
      const delta = Math.abs(value - current)
      if (delta < data.delta) {
        data.delta = delta
        data.nearest = value
      }

      return data
    }, { delta: Infinity, nearest: -1 }).nearest
  }


  const snapToValue = ({ target }) => {
    const value = snapToNearest(target.value)
    treatValue(name, value)
  }


  const setSliderValue = ({ target }) => {
    target = target.closest("p")
    const parent = target.closest(".labels")
    const children = Array.from(parent.children)
    let index = children.indexOf(target)
    if (index < 0) {
      return // Click was not on a pointer-event aware span
    }

    index = snapToNearest(index)
    treatValue(name, index)
  }

  // Create a list of max + 1 entries, where entries at the
  // indices defined in `values` are true, and others are false
  const steps = Array.from({ length: max + 1 })
    .map(( _, index ) => {
      return !(values.indexOf(index) < 0)
    })


  // Create a `<p>` element for each entry in steps, with
  // a class and a label span as defined at the appropriate
  // entries in labels.
  let labelIndex = 0
  let twoSided = false
  const labelPs = steps.map(( showLabel, index ) => {
    if (showLabel) {
      const labelData = labels[labelIndex++]
      const { label, left } = labelData
      const className = left ? "left" : null
      if (left) {
        twoSided = true
      }

      return (
        <p
          key={index}
          className={className}
        >
          <span>{label}</span>
        </p>
      )

    } else {
      return <p key={index}/>
    }
  })


  const inputClass = (min === current) ? "minimum" : null
  const labelClass = twoSided
    ? "two-sided step-slider"
    : "step-slider"


  return (
    <div
      id={`step-slider-${name}`}
      className={labelClass}
    >
      <input
        type="range"
        max={max}
        onInput={snapToValue}
        className={inputClass}
        value={value}
        ref={sliderRef}
      />
      <div
        className="labels"
        onClick={setSliderValue}
      >
        {/* Paragraphs will be shown in reverse order */}
        {labelPs}
      </div>
    </div>
  )
}