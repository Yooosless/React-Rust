import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import LogoutButton from '../navbar/logout';

const Main = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        alert(`Search Query: ${searchQuery}`);
    };

    return (
        <div className="main-container">
            <div className="navbar">
                <h1>Welcome to the Main Page</h1>
                <div className="categories">
                    <Link to="/pickupLine"><button>Pickup Lines</button></Link>
                    <Link to="/roasts"><button>Roasts</button></Link>
                    <Link to="/elevenEleven"><button>11:11</button></Link>
                </div>
                <div className="search-container">
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                        placeholder="Search..." 
                    />
                    <button onClick={handleSearchSubmit}>Search</button>
                </div>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Main;
