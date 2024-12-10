import React, { useState, useEffect } from 'react';
import { useLocation,Link } from 'react-router-dom';
import NavBar from './NavBar';
import defaultProfilePic from '../assets/profile-pic.png';
import { useAuth } from '../contexts/authContext';


const SearchResults = () => {
    const location = useLocation();
    const users = location.state?.users || [];
    const { currentUser } = useAuth();

    // Filter out the current user from the list
    const filteredUsers = users.filter((user) => user.uid !== currentUser.uid);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;

    // State for follower and following counts
    const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });

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

    // Call fetchUserStats on component mount
    useEffect(() => {
        fetchUserStats();
    }, []);

    // Handle Follow button click
    const handleFollow = async (followingId) => {
        try {
            const response = await fetch('http://localhost:5000/api/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    followerId: currentUser.uid,
                    followingId,
                }),
            });

            if (response.ok) {
                console.log(`Successfully followed user with ID: ${followingId}`);
                fetchUserStats(); // Refresh stats after following
            } else {
                console.error('Failed to follow user');
            }
        } catch (error) {
            console.error('Error during follow request:', error);
        }
    };

    // Pagination controls
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            <NavBar />
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto mt-16">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Search Results</h1>
                
                {currentUsers && currentUsers.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {currentUsers.map((user) => (
                            <li
                                key={user.user_id}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50"
                            >
                                <img
                                    src={user.profilePicture || defaultProfilePic}
                                    alt={user.username}
                                    className="w-14 h-14 rounded-full mr-4 border border-gray-300"
                                />
                                <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">
                                    <Link
                                        to={`/user-profile/${user.uid}`}
                                        className="text-slate-950 hover:text-yellow-500"
                                    >
                                        {user.firstName} {user.lastName}
                                    </Link>
                                </h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => handleFollow(user.uid)}
                                    className="ml-4 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-slate-950 transition-colors duration-200"
                                >
                                    Follow
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">No users found. Try a different search.</p>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                                currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition duration-200`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                                currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition duration-200`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;
