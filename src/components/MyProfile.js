import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import NavBar from './NavBar';
import defaultProfilePic from '../assets/profile-pic.png';



const MyProfile = () => {
    const { currentUser, userRole } = useAuth();
    const [view, setView] = useState('home');
    const [profileData, setProfileData] = useState({
    profilePicture: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    bio: '',
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's profile data from the server
    const fetchProfileData = async () => {
      try {
        

        // Send uid and other user info to your backend
        const response = await fetch('http://localhost:5000/get-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: currentUser.uid            
            }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Error fetching profile data.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <>
    <NavBar setView={setView} />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={profileData.profilePicture || defaultProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        </div>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">First Name:</span>
                <span>{profileData.firstName}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Last Name:</span>
                <span>{profileData.lastName}</span>
            </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Birthdate:</span>
            <span>{profileData.birthDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Gender:</span>
            <span>{profileData.gender}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Bio:</span>
            <span>{profileData.bio || 'No bio provided'}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;
