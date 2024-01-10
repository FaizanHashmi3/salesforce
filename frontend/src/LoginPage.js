import React from 'react'
import './App.css'

function LoginPage({handleSalesforceAuth}) {
  return (
    <div>
         <div className='login'>
          <h1>Login here ...  </h1>
      <button onClick={()=>{handleSalesforceAuth()}}>Login</button>
        </div>
    </div>
  )
}

export default LoginPage