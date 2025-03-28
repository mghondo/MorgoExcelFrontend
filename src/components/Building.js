// src/Ordering.js
import React, { useState, useEffect } from 'react';
import './ordering.css';
import JumbotronComponent from './Jumbotron/JumbotronComponent';
import Login from './Login';
import OrderingPredict from './OrderingPredict';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Building() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <>
       <JumbotronComponent title="Building" showSlogan={false}/>
      <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
       <JumbotronComponent title="Welcome" showSlogan={false}/>
       {/* <OrderingPredict/> */}
       <h1 className='text-center'>Welcome to Build</h1>
       
    </>
  );
}

export default Building;
