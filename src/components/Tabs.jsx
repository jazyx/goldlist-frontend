/**
 * Notes/Tabs.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TabButton } from './TabButton'


export const Tabs = (props) => {
  const { userData } = useContext(UserContext)
  const { list, redos } = userData


  const byIndex = (a, b) => {
    return b.list.index - a.list.index
  }


  redos.sort(byIndex)


  const redoTabs = redos.map(({ list }) => {
    return <TabButton { ...list } key={list._id}/>
  })


  return (
    <ul
      id="tabs"
    >
      <TabButton key="add" />
      {redoTabs}
    </ul>
  )
}