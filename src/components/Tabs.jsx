/**
 * Notes/Tabs.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TabButton } from './TabButton'


export const Tabs = () => {
  const { lists, redos } = useContext(UserContext)


  const checkTabs = lists.map(( list, index ) => {
    const { _id } = list
    return <TabButton { ...list } key={_id} check={index}/>
  })


  const redoTabs = redos?.map( list => {
    return <TabButton { ...list } key={list._id}/>
  })


  return (
    <ul
      id="tabs"
    >
      {checkTabs}
      {redoTabs}
    </ul>
  )
}