/**
 * frontend/src/components/Feedback.jsx
 * 
 * Generate feedback with red spans to show correct character
 * where the wrong character has been used. Use ⨉ when no more
 * text is expected.
 */

import { forwardRef } from "react"


export const Feedback = forwardRef(
  ({ feedback, className }, ref ) => {
    return (
      <p
        className={className}
        ref={ref}
      >
        {feedback}
      </p>
    )
  }
)