import React from 'react'
import CourseDepartment from '../../HomeComonents/CourseDepartment'

const Home = () => {
  return (
    <div className='container-fluid w-100'>
    <div className="row">
      <div className="col-12">
        <h3 className='p-0 fontColor'>Home</h3>
      </div>
      <div>
        <CourseDepartment />
      </div>
    </div>
  </div> 
  )
}

export default Home