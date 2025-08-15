/**
 * frontend/src/tools/useCase.js
 */



import sklonenie from 'sklonenie'
const CYRILLIC_REGEX = /[А-Яа-яЁё]/



export const useCase = (language, name, fallback, падеж=1) => {
  if (!name) {
    // user_name is not set for guests
    return fallback

  } else if (language === "ru" && CYRILLIC_REGEX.test(name)) {
    name = sklonenie(name)[падеж][0] // genitive first name
  }

  return name
}