import React from 'react'
import UserTable from './UserTable'

const User = () => {
  return (
    <div className='container-fluid w-100'>
    <div className="row">
      <div className="col-12">
        <h3 className='p-0 fontColor'>Users</h3>
      </div>
      <div>
        <UserTable />
      </div>
    </div>
  </div>  
  )
}

export default User