import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import LogoutButton from '../navbar/logout';
import Footer from './Footer/Footer';
const Main = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        alert(`Search Query: ${searchQuery}`);
    };

    return (
        <div className="main-container">
            <div className="navbar">
                <h1>Welcome {userName}!!</h1>
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
            <Footer />
        </div>
    );
};

export default Main;
