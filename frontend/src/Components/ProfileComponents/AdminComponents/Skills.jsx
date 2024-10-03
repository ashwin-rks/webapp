import React from 'react'
import SkillTable from './SkillTable'

const Skills = () => {
  return (
    <div className='container-fluid w-100'>
      <div className="row">
        <div className="col-12">
          <h3 className='p-0 fontColor'>Skills</h3>
        </div>
        <div>
          <SkillTable />
        </div>
      </div>
    </div>  
  )
}

export default Skills