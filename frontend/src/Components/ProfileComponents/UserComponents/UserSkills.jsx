import React from 'react'
import UserSkillsTable from './UserSkillsTable'

const UserSkills = () => {
  return (
    <div className='container-fluid w-100'>
    <div className="row">
      <div className="col-12">
        <h3 className='p-0 fontColor'>Skills</h3>
      </div>
      <div>
        <UserSkillsTable />
      </div>
    </div>
  </div>  
  )
}

export default UserSkills