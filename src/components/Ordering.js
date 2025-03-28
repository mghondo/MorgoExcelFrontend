// src/Ordering.js
import React, { useState, useEffect } from 'react';
import './ordering.css';
import JumbotronComponent from './Jumbotron/JumbotronComponent';
import Login from './Login';
import OrderingPredict from './OrderingPredict';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Ordering() {
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
       <JumbotronComponent title="Ordering" showSlogan={false}/>
      <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
       <JumbotronComponent title="Welcome to Ordering" showSlogan={false}/>
       <OrderingPredict/>
    </>
  );
}

export default Ordering;
