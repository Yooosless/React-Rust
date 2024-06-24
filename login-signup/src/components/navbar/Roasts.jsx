import React, { useState } from 'react';
import './Roasts.css';

const Roasts = () => {
    const [roast, setRoast] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRoast, setShowRoast] = useState([]);
    const [clickCount, setClickCount] = useState(0);

    const fetchRoast = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token
            const response = await fetch('http://localhost:8080/api/insult', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRoast(data.insult);
            setShowRoast(lines => [data.insult, ...lines].slice(0, 3)); // Limit to 3 lines
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleYesClick = () => {
        fetchRoast();
        setClickCount(count => count + 1);
    };

    return (
        <div className='roasts-container'>
            <h2>Roasts</h2>
            <p>Want to hear a Roast?</p>
            <button onClick={handleYesClick} disabled={loading}>
                {loading ? 'Loading...' : clickCount === 0 ? 'Yes' : 'Another one?'}
            </button>
            {showRoast.map((line, index) => (
                <div key={index} className={`roast-text line-${index}`}>
                    <p>{line}</p>
                </div>
            ))}
        </div>
    );
};

export default Roasts;
