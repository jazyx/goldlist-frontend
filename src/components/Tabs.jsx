/**
 * frontend/src/components/Tabs.jsx
 */



import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TabButton } from './TabButton'
import { Menu } from './Menu'
import { FullScreen } from './FullScreen'


export const Tabs = () => {
  const { lists, redos } = useContext(UserContext)


  const checkTabs = lists.map(( list, index ) => {
    const { _id } = list
    return (
      <TabButton
        key={_id}
        check={index}
        { ...list } // for index and reviews
      />
    )
  })


  const redoTabs = redos?.map(list => {
    return (
      <TabButton
        key={list._id}
        { ...list } // for index and reviews
      />
    )
  })


  return (
    <ul
      id="tabs"
    >
      <Menu />
      {checkTabs}
      {redoTabs}
      <FullScreen />
    </ul>
  )
}