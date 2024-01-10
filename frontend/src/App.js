

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Loader from './Loader';
import LoginPage from './LoginPage';
import MetaPage from './metaPage';
import ValidationList from './ValidationList';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [validationRules, setValidationRules] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const [metaButton, setMetaButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

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
      console.log(username);
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
      setIsLoading(true)
      setMetaButton(true);
      const response = await axios.get('https://salesforce-api.onrender.com/getValidationRules', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // console.log(response.data.records);
      setValidationRules(response.data.records);
      setIsLoading(false);
      // setMetaButton(false);

    

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
      // setIsToggled(!isToggled);
      
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
      <div style={{ color: "brown", fontSize: "4rem" }}>Salesforce Switch</div>

      { !accessToken && !isLoading ? (
       <LoginPage handleSalesforceAuth={handleSalesforceAuth} />
      ) :  ( isLoading ? (<Loader/>):
      (metaButton ?
        (<ValidationList name={name} handleDisable={handleDisable} handleEnable={handleEnable} validationRules={validationRules} handleToggle={handleToggle}/>):
         (<MetaPage name={name} fetchValidationRules={fetchValidationRules}/>))) 
      
      
      }
      
    </div>
  );
};

export default App;








