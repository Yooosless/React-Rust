import React, { useState, useEffect } from 'react';
import './ElevenEleven.css';
import axios from 'axios';

const ElevenEleven = ({ userId }) => {
    const [elevenEleven, setElevenEleven] = useState("");
    const [wishes, setWishes] = useState([]);
    const [isAllowedTime, setIsAllowedTime] = useState(false);

    useEffect(() => {
        const checkAllowedTime = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const allowedTime = (
                (currentHour === 11 && currentMinute >= 11 && currentMinute <= 12) ||
                (currentHour === 23 && currentMinute >= 11 && currentMinute <= 12)
                //(currentHour > 0)
            );
            setIsAllowedTime(allowedTime);
        };

        checkAllowedTime();
        const interval = setInterval(checkAllowedTime, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchWishes = async () => {
        if (userId) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/wishes/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setWishes(response.data);
            } catch (error) {
                console.error("There was an error fetching wishes!", error);
            }
        }
    };

    useEffect(() => {
        fetchWishes();
    }, [userId]);

    const handleElevenElevenChange = (event) => {
        setElevenEleven(event.target.value);
    };

    const handleSubmit = async () => {
        if (!isAllowedTime) {
            alert("You can only make a wish between 11:11 and 11:12 AM/PM.");
            return;
        }

        if (elevenEleven.trim() !== "") {
            const newWish = {
                text: elevenEleven,
            };

            try {
                const token = localStorage.getItem('token');
                await axios.post(`http://localhost:8080/api/wishes/${userId}`, newWish, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchWishes(); // Re-fetch the wishes after submitting a new wish
                setElevenEleven("");
            } catch (error) {
                console.error("There was an error saving the wish!", error);
            }
        }
    };

    return (
        <div className="eleven-eleven-container">
            <div className="title">
                <h2>11:11 - Make a wish</h2>
            </div>
            <div className="content">
                <div className="wishes-list">
                {wishes.slice().reverse().slice(0, 3).map((wish, index) => (
                        <div key={index} className="wish-item">
                            <span className="wish-text">{wish.text}</span>
                            <span className="wish-timestamp">{wish.timestamp}</span>
                        </div>
                    ))}
                </div>
                <div className="left-side">
                    <div className="wish-count">
                        Total Wishes: <span>{wishes.length}</span>
                    </div>
                </div>
            </div>
            <div className="input-container">
                <input 
                    type="text" 
                    value={elevenEleven} 
                    onChange={handleElevenElevenChange} 
                    placeholder={isAllowedTime ? "Enter your 11:11 wish" : "It is not 11:11 yet"}                   
                    disabled={!isAllowedTime}
                />
                <button onClick={handleSubmit} disabled={!isAllowedTime}>
                    {isAllowedTime ? "Make a wish" : "Come back at 11:11"}
                </button>
            </div>
        </div>
    );
};

export default ElevenEleven;
