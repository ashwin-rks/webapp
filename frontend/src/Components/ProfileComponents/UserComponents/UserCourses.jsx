import React from 'react'
import UserCoursesGrid from './UserCoursesGrid'


const UserCourses = () => {
  return (
    <div className='container-fluid w-100'>
    <div className="row">
      <div className="col-12">
        <h3 className='p-0 fontColor'>Courses</h3>
      </div>
      <div>
        <UserCoursesGrid />
      </div>
    </div>
  </div>  
  )
}

export default UserCourses