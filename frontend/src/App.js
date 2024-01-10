

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import './App.css';
import Loader from './Loader';
import LoginPage from './LoginPage';
import MetaPage from './metaPage';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [validationRules, setValidationRules] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const [metaButton, setMetaButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [able, setAble] = useState(false);
  const [name, setName] = useState('');
  // const [flag,setFlag] = useState(false);
  // const [btn,setBtn] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  const fetchAccessToken = async (code) => {
 
    try {
      setIsLoading(true);
      console.log("authCode>> " + code);
      const response = await axios.get(`https://salesforce-api.onrender.com/oauth2/callback?code=${code}`);
      const accessToken = await response.data.accessToken;
      const username = await response.data.username;
      setName(username);
      // console.log("response.data");
      console.log(accessToken);
      // console.log(username);
      // console.log(response.data);

      setAccessToken(accessToken);
      setIsLoading(false);
      // setBtn(false);
    
      // fetchValidationRules();
      // console.log("acessTknfrnt>> "+access_token);
      // console.log("resdata>> "+response.data);
    } catch (error) {
      console.error('Error fetching access token: Frontend', error);
    }
  };



  const fetchValidationRules = async () => {
    try {
      
      const response = await axios.get('https://salesforce-api.onrender.com/getValidationRules', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // console.log(response.data.records);
      setValidationRules(response.data.records);

    

    } catch (error) {
      console.error('Error fetching validation rules:frontend', error);
    }
  };

  const handleSalesforceAuth = () => {
    setIsLoading(true)
    // setBtn(false);
    const clientId = '3MVG95mg0lk4batjVwHpPkahCROA1JXckG2MoWXqDTqMcv2sI4NjLmzIJq33BJka_FCR0TwINW3LN.Yuclvxa';
    const redirectUri = 'https://salesforce-front.vercel.app';

    const salesforceAuthUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    window.location.href = salesforceAuthUrl;
   
  };
  const handleToggle = async (ruleId, currentStatus, formula, errormsg) => {
    try {
      
      const newStatus = !currentStatus;
      const response = await axios.put(`https://salesforce-api.onrender.com/toggleValidationRule/${ruleId}`, { newStatus, formula, errormsg });

      // console.log("response.data.updatedRule");
      console.log(response.data);
      // setValidationRules(response.data.updatedRule); 
      fetchValidationRules();
      setIsToggled(!isToggled);
      
    } catch (error) {
      console.error('Error toggling validation rule status:', error);

    }
  };

  function handleDisable() {
    
    validationRules.forEach(item => {
      handleToggle(item.Id, true, item.Metadata.errorConditionFormula, item.Metadata.errorMessage);
    });
  }
  async function handleEnable() {

    validationRules.forEach(item => {
      handleToggle(item.Id, false, item.Metadata.errorConditionFormula, item.Metadata.errorMessage);
    });
  }






  return (
    <div className='App'>
      <div style={{ color: "green", fontSize: "4rem" }}>Salesforce Switch</div>

      { !accessToken && !isLoading ? (
       <LoginPage handleSalesforceAuth={handleSalesforceAuth} />
      ) :  ( isLoading ? (<Loader/>):(<MetaPage name={name} fetchValidationRules={fetchValidationRules}/>)) }
      {/* : (able && isLoading ? (<Loader />) : <div>
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
      </div>)
      )} */}








    </div>
  );
};

export default App;








