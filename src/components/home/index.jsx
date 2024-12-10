import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NavBar from '../NavBar';
import { useAuth } from '../../contexts/authContext';

const Home = () => {
  const [view, setView] = useState('home');
  const { currentUser, userRole } = useAuth();


  return (
    <div className="flex h-screen">
      {/* Sidebar navigation */}
      <NavBar setView={setView} />
      
      {/* Main content area */}
      <div className="flex-grow ml-64 p-6">
        
        
        
      </div>
    </div>
  );
};

export default Home;
