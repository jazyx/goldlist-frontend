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
  placeholder,
  spellCheck
}) => {

  text = typeof text === "string" ? text : ""
  placeholder = typeof placeholder === "string" ? placeholder: ""

  return (
    <textarea
      name={name}
      className={className}
      spellCheck={spellCheck}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={onFocus}
      onScroll={onScroll}
      value={text}
      placeholder={placeholder}
    />
  )
}