import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import logo from '../assets/head_link.png';
import search_icon from '../assets/search-icon.png';
import axios from 'axios';


const NavBar = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { currentUser, userRole } = useAuth();
    const [isSearchVisible, setIsSearchVisible] = useState(false);


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert('Please enter a search term.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:5000/search-users', {
                params: { query: query },
            });
            console.log('Search Results:', response.data.users);
    
            // Navigate to SearchResults with results
            navigate('/search-results', { state: { users: response.data.users } });
    
            setIsOpen(false); // Close the popup after search
        } catch (error) {
            console.error('Error during search:', error);
            alert('Something went wrong with the search. Please try again.');
        }
    };
    

    return (
        <nav className="fixed top-0 left-0 w-full bg-slate-50 text-white flex justify-center py-2 shadow-md">
            {/* Central Container for Content */}
            <div className="w-full max-w-6xl flex items-center justify-between px-4">
                {/* Logo Section */}
                <div className="flex items-center">
                    
                    <span className="font-bold text-3xl text-slate-950">Virtus</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-3">
                    {userLoggedIn ? (
                        <>
                            {/* Toggle Search Bar */}
                            {isSearchVisible && (
                                <form onSubmit={handleSearch} className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="px-4  w-30 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 bg-yellow-500 text-white px-3 rounded-lg hover:bg-slate-950 transition duration-200"
                                >
                                    Go
                                </button>
                                </form>
                            )}
                            <button
                                onClick={() => setIsSearchVisible((prev) => !prev)}
                                className="focus:outline-none"
                            >
                                <img
                                src={search_icon}
                                alt="Search"
                                className="w-6 h-6 transition-opacity duration-200 hover:opacity-50"
                                />
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="decoration-black text-gray-800 hover:text-gray-300"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/groups')}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Groups
                            </button>
                            <button
                                onClick={() => navigate('/challenges')}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Challenges
                            </button>
                            <button
                                onClick={() => navigate(`/user-profile/${currentUser.uid}`)}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                My Profile
                            </button>
                            
                            <button
                                onClick={async () => {
                                    await doSignOut();
                                    navigate('/login');
                                }}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/groups')}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Groups
                            </button>
                            <button
                                onClick={() => navigate('/challenges')}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Challenges
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-800 hover:text-gray-300"
                            >
                                Log In
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* Popup Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
                    <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                    &times;
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Search</h2>
                    <form onSubmit={handleSearch} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="px-4 py-2 w-full text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Search
                    </button>
                    </form>
                </div>
                </div>
            )}
        </nav>

        
    );
};

export default NavBar;
