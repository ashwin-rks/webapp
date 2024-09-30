import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  return (
    <div className='container-fluid vh-100'>
      {/* Top Center Title */}
      <div className='text-center position-absolute top-0 start-50 translate-middle-x mt-3'>
        <h2>Skill Assessment</h2>
      </div>

      <div className='row h-100'>
        {/* Left Side: Motivational Text */}
        <div className='col-md-8 d-none d-md-flex justify-content-center align-items-center bg-light'>
          <div className='text-center'>
            <h1 className='font-weight-bold' style={{ fontSize: '5rem' }}>
              Imporvise.<br />
              Adapt.<br />
              Overcome.
            </h1>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className='col-md-4 d-flex justify-content-center align-items-center'>
          <div className='signup-form'>
            <h2 className='d-md-none text-center'>Skill Assessment</h2> {/* For mobile view only */}
            {/* Placeholder for Signup Form */}
            <form>
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input type='text' className='form-control' id='name' placeholder='Enter your name' />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input type='email' className='form-control' id='email' placeholder='Enter your email' />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input type='password' className='form-control' id='password' placeholder='Enter your password' />
              </div>
              <button type='submit' className='btn btn-primary btn-block'>Sign Up</button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className='d-md-none text-center mt-5'>
        <h2>Skill Assessment</h2>
        {/* Placeholder for Signup Form */}
        <form className='mt-3'>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' className='form-control' id='name' placeholder='Enter your name' />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' className='form-control' id='email' placeholder='Enter your email' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' className='form-control' id='password' placeholder='Enter your password' />
          </div>
          <button type='submit' className='btn btn-primary btn-block'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
