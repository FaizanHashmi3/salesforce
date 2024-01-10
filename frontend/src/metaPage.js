import React from 'react'
import './App.css';

function MetaPage({name, fetchValidationRules}) {
  return (
    <div>
        <div className='meta-page'>
        <h2>Username: {name}</h2>
        <button className='meta-btn' onClick={()=>{fetchValidationRules()}}>Get Metadata</button>
      </div>
    </div>
  )
}

export default MetaPage