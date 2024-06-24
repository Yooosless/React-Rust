import React, { useState } from 'react';
import './PickupLine.css';

const PickupLine = () => {
    const [pickupLine, setPickupLine] = useState('');
    const [loading, setLoading] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [pickupLines, setPickupLines] = useState([]);

    const fetchPickupLine = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token
            const response = await fetch('http://localhost:8080/api/pickupLine', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPickupLine(data.text);
            setPickupLines(lines => [data.text, ...lines].slice(0, 3)); // Limit to 3 lines
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        fetchPickupLine();
        setClickCount(count => count + 1);
    };

    return (
        <div className='pickup-line-container'>
            <h2>Pickup Line</h2>
            <p>Want to hear a Pickup Line?</p>
            <button onClick={handleClick} disabled={loading}>
                {loading ? 'Loading...' : clickCount === 0 ? 'Yes' : 'Another one?'}
            </button>
            {pickupLines.map((line, index) => (
                <div key={index} className={`pickup-line-text line-${index}`}>
                    <p>{line}</p>
                </div>
            ))}
        </div>
    );
};

export default PickupLine;
