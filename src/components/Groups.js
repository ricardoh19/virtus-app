import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import defaultProfilePic from '../assets/profile-pic.png';

const WorkoutGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('Posts'); // Default view


    // Fetch existing groups from an API or database
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch('http://localhost:5000/api/groups');
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    // Function to handle creating a new group
    const handleCreateGroup = async () => {
        try {
            const groupName = prompt('Enter the name of the new group:');
            const location = prompt('Enter the location of the new group:');
            const group_type = prompt('Enter the type of the new group (Powerlifting, bodybuilding, etc.):');
            
            if (!groupName) return;

            // Replace with your actual API call to create a group
            const response = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group_name: groupName, location: location, group_type: group_type }),
            });

            if (response.ok) {
                const newGroup = await response.json();
                setGroups((prevGroups) => [...prevGroups, newGroup]);
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <>
        <NavBar setView={setView} />
        <div className="min-h-screen bg-gray-100 p-6 mt-12">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Workout Groups</h1>
                <button 
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-slate-950 transition duration-200"
                    onClick={handleCreateGroup}
                >
                    Create Group
                </button>
                {loading ? (
                    <p className="text-gray-500 mt-4">Loading groups...</p>
                ) : groups.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {groups.map((group) => (
                            <li 
                                key={group.id} 
                                className="flex items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 transition duration-200"
                            >
                                <img 
                                    src={group.profile_picture || defaultProfilePic} 
                                    alt={group.group_name} 
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-800">{group.group_name}</h2>
                                    <p className="text-sm text-gray-500">{group.location}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-medium">{group.members_count || 0}</span> members &bull; {group.group_type}
                                    </p>
                                    <button
                                        
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-slate-950 transition duration-200"
                                    >
                                        Join
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-4">No groups available. Create one to get started!</p>
                )}
            </div>
        </div>
        </>
    );
};

export default WorkoutGroups;
