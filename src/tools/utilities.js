/**
 * frontend/src/tools/array.js
 */



export const byIndex = (a, b) => {
  return b.index - a.index
}


// https://www.freecodecamp.org/news/javascript-debounce-example/


export const debounce = (debouncedFunction, immediate, delay = 300) => {
  if (typeof immediate === "number") {
    // Ignore immediate; use its value to overwrite default delay
    delay = immediate
    immediate = false
  }
  let timeout

  return (...args) => {
    const callNow = immediate && !timeout
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        timeout = 0
        debouncedFunction.apply(null, args)
      },
      delay
    );

    if (callNow) {
      debouncedFunction.apply(null, args)
    }
  };
}


// // USAGE //
// function postBounce(a,b,c){
//   console.log('Done', a, b, c);
// }
// const processChange = debounce(postBounce);
// for ( let ii = 0; ii < 1000; ii += 1 ) {
//   processChange(2,3,4)
// }
// // Will print Done 2 3 4 after bouncing is done


/**
 * 
 * @param data may be an object with (24) hour and minute integer
 *             entries, a date string, and a boolean past.
 * @returns    If past is truthy, returns the closest time in the
 *             past when the time was the given time; if not,
 *             returns the time today when it was or will be that
 *             time
 */
export const getLocalTime = (data) => {
  const { hour=0, minute=0, past=true, date } = (data || {})
  const now = date ? new Date(date) : new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  let time = new Date(
    year, month, day,     // today's date
    hour, minute, 0, 0
  );

  if (past) {
  // If current time is before timeToday, use yesterday's time
    if (now < time) {
      time = new Date(
        year, month, day - 1, // yesterday's date
        hour, minute, 0, 0
      );
    }
  }

  return time
}