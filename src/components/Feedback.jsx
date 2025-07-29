/**
 * frontend/src/components/Feedback.jsx
 * 
 * Generate feedback with red spans to show correct character
 * where the wrong character has been used. Use ⨉ when no more
 * text is expected.
 */


export const Feedback = ({ feedback, className }) => {


  return (
    <p
      className={className}
    >
      {feedback}
    </p>
  )
}