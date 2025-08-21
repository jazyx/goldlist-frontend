/**
 * frontend/src/components/TextArea.jsx
 */



export const TextArea = ({
  name,
  text,
  className,
  autoCapitalize,
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
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
      onBlur={onBlur}
      onScroll={onScroll}
      value={text}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
    />
  )
}