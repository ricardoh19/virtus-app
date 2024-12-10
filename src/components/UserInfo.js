import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const { saveUserRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.birthDate || !userInfo.gender) {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/userInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid, // Include the current user's UID
          ...userInfo,         // Include user information
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save user information.');
      }
  
     
      setIsSaved(true);
      navigate('/dashboard');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell us about yourself</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={userInfo.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            value={userInfo.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="date"
            name="birthDate"
            value={userInfo.birthDate}
            onChange={handleChange}
            placeholder="Birth Date"
            className="w-full p-3 border rounded-lg"
          />
          <select
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Save Information
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
