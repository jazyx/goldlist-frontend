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
  onFocus,
  onScroll,
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
      spellCheck="false"
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={onFocus}
      onScroll={onScroll}
      value={text}
      placeholder={placeholder}
    />
  )
}