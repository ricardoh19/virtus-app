import NavBar from './NavBar';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import defaultProfilePic from '../assets/profile-pic.png';
import { useNavigate } from 'react-router-dom';





const Dashboard = () => {
    const [view, setView] = useState('home');
    const { currentUser, userRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        profilePicture: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        bio: '',
        });
    const navigate = useNavigate();
    // State for follower and following counts
    const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });


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

            // Fetch user stats
    const fetchUserStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/${currentUser.uid}/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats({
                    followersCount: data.followersCount,
                    followingCount: data.followingCount,
                });
            } else {
                console.error('Failed to fetch user stats');
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
      };
        
            fetchProfileData();
            fetchUserStats();
          }, []);

          if (loading) {
            return <div className="text-center mt-10">Loading profile...</div>;
          }

    return (
        <>
            <NavBar setView={setView} />
            <div className="flex flex-row min-h-screen bg-gray-100 p-6" style={{ paddingTop: '4rem'}}>
            {/* Left Column: User Info */}
            <div className="w-1/4 bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                <img
                    src={profileData.profilePicture || defaultProfilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
                </div>
                <div className="flex justify-around text-center mb-4">
                <div>
                    <p className="text-xl font-bold">{stats.followersCount}</p>
                    <p className="text-gray-600 text-sm">Followers</p>
                </div>
                <div>
                    <p className="text-xl font-bold">{stats.followingCount}</p>
                    <p className="text-gray-600 text-sm">Following</p>
                </div>
                </div>
                <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🏋️‍♂️ Gym split</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>Monday: Chest & Triceps</li>
                    <li>Tueday: Back & Biceps</li>
                    <li>Wednesday: Legs & Shoulders</li>
                    <li>Thursday: Abs</li>
                    <li>Firday: Rest</li>
                </ul>
                </div>


            </div>

            {/* Center Column: Posts */}
            <div className="w-1/2 mx-4 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                {/* Example Post */}
                <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                    <img
                        src="/default-profile.png"
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-3"
                    />
                    <h4 className="font-semibold text-gray-800">John Doe</h4>
                    </div>
                    <p className="text-gray-700">
                    Just finished a killer chest workout! Feeling strong 💪.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">2 hours ago</p>
                </div>
                {/* Add more posts dynamically */}
                </div>
            </div>

            {/* Right Column: Challenges and Invite Friends */}
            <div className="w-1/4 bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-950 mb-4">Challenges</h3>
                <button onClick={() => navigate('/challenges')} className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-slate-950 transition duration-200">
                    See All Challenges
                </button>
                </div>
                <div>
                <h3 className="text-lg font-semibold text-slate-950 mb-4">Find your Friends</h3>
                <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-slate-950 transition duration-200">
                    Invite Friends
                </button>
                </div>
            </div>
            </div>
        </>
    );
    };

export default Dashboard;
