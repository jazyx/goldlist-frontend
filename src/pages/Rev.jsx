/**
 * frontend/src/pages/Rev.jsx
 */


import { useParams } from 'react-router'
import { Tabs } from '../components/Tabs'


export const Rev = (props) => {
  const params = useParams()
  const { index } = params


  return (
    <main>
      <Tabs/>
      <h1>Rev {index} goes here</h1>
    </main>
  )
}