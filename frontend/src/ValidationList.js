import React from 'react'
import './App.css';
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

function ValidationList({name,handleDisable,handleEnable,validationRules,handleToggle}) {
  return (
    <div>
        <div>
        <div>
          <h2>Username: {name}</h2>
          <button className='disable-btn' onClick={() => handleDisable()}>Disable all</button>
          <button className='enable-btn' onClick={() => handleEnable()}>Enable all</button>

        </div>
        <div>
          <table className='table-body'>
            <tr>
              <th className='th'>Validation Rules</th>
              <th className='th'>Active status</th>
            </tr>
            {validationRules.map((item, key) => {
              return (<tr key={item.Id}>

                <td>{item.ValidationName}</td>
                <td className='toggle' onClick={() => {
                  handleToggle(item.Id, item.Metadata.active, item.Metadata.errorConditionFormula, item.Metadata.errorMessage
                  )
                }}>{item.Metadata.active ? (<FaToggleOn color="green" size={30} />) :
                  (<FaToggleOff color="red" size={30} />)
                  }</td>

              </tr>
              )
            })}
          </table>
        </div>
        </div>
    </div>
  )
}

export default ValidationList