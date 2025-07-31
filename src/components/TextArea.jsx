/**
 * frontend/src/components/TextArea.jsx
 */


import React from 'react'


export const TextArea = ({
  name,
  text,
  className,
  onKeyDown,
  onChange,
  placeholder
}) => {

  text = text || ""
  placeholder = placeholder
    ? String(placeholder)
    : (name === "text")
      ? "Enter a phrase that you want to remember"
      : "Enter a hint about meaning of the phrase"

  return (
    <textarea
      name={name}
      className={className}
      onKeyDown={onKeyDown}
      onChange={onChange}
      value={text}
      placeholder={placeholder}
    />
  )
}