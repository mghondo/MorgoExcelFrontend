// src/Ordering.js
import React, { useState } from 'react';
import './ordering.css';
import JumbotronComponent from './Jumbotron/JumbotronComponent';
import Login from './Login';

function Ordering() {
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
       <JumbotronComponent title="Welcome" showSlogan={false}/>
      Ordering Page
    </>
  );
}

export default Ordering;
