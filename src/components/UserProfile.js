import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import defaultProfilePic from '../assets/profile-pic.png';
import defaultCoverPic from '../assets/cover-pic.png';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import WorkoutPBs from './WorkoutPBs';

// Placeholder components for each section
const Posts = () => <div>Posts Section</div>;
const Overview = () => <div>Overview Section</div>;
const Achievements = () => <div>Achievements Section</div>;
const Groups = () => <div>Groups Section</div>;

const UserProfile = () => {
    const { uid } = useParams(); // Get UID from URL
    const [view, setView] = useState('Posts'); // Default view
    const [profileData, setProfileData] = useState({
        profilePicture: '',
        firstName: '',
        lastName: '',
        bio: '',
    });
    const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid }),
                });
                if (!response.ok) throw new Error('Failed to fetch profile data.');

                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchUserStats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${uid}/stats`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();
        fetchProfileData();
    }, [uid]);

    const isCurrentUser = uid === currentUser.uid;

    const renderView = () => {
        switch (view) {
            case 'Posts': return <Posts />;
            case 'Overview': return <Overview />;
            case 'Achievements': return <Achievements />;
            case 'WorkoutPRs': return <WorkoutPBs uid={uid} />;
            case 'Groups': return <Groups />;
            default: return <Posts />;
        }
    };

    return (
        <>
            <NavBar setView={setView} />
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="mt-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                    <div className="relative">
                        <img
                            src={profileData.profilePicture || defaultCoverPic}
                            alt="Cover"
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                            <img
                                src={profileData.profilePicture || defaultProfilePic}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="text-center mt-16">
                        <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                        <p className="text-gray-600">{profileData.bio}</p>
                        <div className="flex justify-center mt-4 space-x-8">
                            <div>
                                <p className="text-lg font-bold">{stats.followersCount}</p>
                                <p className="text-sm text-gray-600">Followers</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold">{stats.followingCount}</p>
                                <p className="text-sm text-gray-600">Following</p>
                            </div>
                        </div>
                        {!isCurrentUser && (
                            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Follow
                            </button>
                        )}
                    </div>
                    <div className="mt-8 border-t">
                        <div className="flex justify-around p-4">
                            {['Overview', 'Posts', 'Achievements', 'WorkoutPRs', 'Groups'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setView(tab)}
                                    className={`py-2 px-4 ${view === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                    {renderView()}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
