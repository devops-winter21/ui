// Libraries
import React, {FC, useContext} from 'react'

// Components
import {Dropdown, ComponentColor} from '@influxdata/clockface'
import {UsersContext} from 'src/users/context/users'

// Constants
import {roles} from 'src/users/constants'

// Types
import {Role} from 'src/types'

const UserRoleDropdown: FC = () => {
  const {draftInvite, handleEditDraftInvite} = useContext(UsersContext)

  const onChangeRole = (role: Role) => () => {
    handleEditDraftInvite({...draftInvite, role})
  }

  const dropdownButton = (active, onClick) => (
    <Dropdown.Button
      className="user-role--dropdown--button"
      active={active}
      onClick={onClick}
      color={ComponentColor.Secondary}
    >
      {draftInvite.role}
    </Dropdown.Button>
  )

  const dropdownItems = roles.map(role => (
    <Dropdown.Item
      className="user-role--dropdown-item"
      id={role}
      key={role}
      value={role}
      onClick={onChangeRole(role)}
    >
      {role}
    </Dropdown.Item>
  ))

  const dropdownMenu = onCollapse => (
    <Dropdown.Menu onCollapse={onCollapse}>{dropdownItems}</Dropdown.Menu>
  )

  return <Dropdown button={dropdownButton} menu={dropdownMenu} />
}

export default UserRoleDropdown
