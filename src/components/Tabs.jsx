/**
 * Notes/Tabs.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TabButton } from './TabButton'


export const Tabs = (props) => {
  const { lists, redos } = useContext(UserContext)


  const byIndex = (a, b) => {
    return b.list.index - a.list.index
  }


  redos?.sort(byIndex)


  const editTabs = lists.map(( list, edit ) => {
    const { index } = list
    const key = `edit_${index}`
    return <TabButton { ...list } key={key} edit={edit}/>
  })


  const redoTabs = redos?.map(({ list }) => {
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