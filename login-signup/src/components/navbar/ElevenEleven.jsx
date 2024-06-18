import React, { useState,useEffect  } from 'react';
import './ElevenEleven.css';

const ElevenEleven = () => {
    const [elevenEleven, setElevenEleven] = useState("");
    const [wishes, setWishes] = useState([]);
    const [isAllowedTime, setIsAllowedTime] = useState(false);

    useEffect(() => {
        const checkAllowedTime = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const allowedTime = (
                //(currentHour === 11 && currentMinute >= 11 && currentMinute <= 12) ||
                //(currentHour === 23 && currentMinute >= 11 && currentMinute <= 12)
            (currentHour>0)
            );
            setIsAllowedTime(allowedTime);
        };

        // Check every minute if it's within allowed time range
        checkAllowedTime();
        const interval = setInterval(checkAllowedTime, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const handleElevenElevenChange = (event) => {
        setElevenEleven(event.target.value);
    };
    const handleSubmit = () => {
        //if (!isAllowedTime) {
        //    alert("You can only make a wish between 11:11 and 11:12 AM/PM.");
        //    return;
       // }

        if (elevenEleven.trim() !== "") {
            const newWish = {
                text: elevenEleven,
                timestamp: new Date().toLocaleString(),
            };
            setWishes([newWish, ...wishes]);
            setElevenEleven("");
        }
    };

    return (
        <div className="eleven-eleven-container">
            <div className="title">
                <h2>11:11-Make a wish</h2>
            </div>
            <div className="content">
             
                <div className="wishes-list">
                    {wishes.slice(0, 3).map((wish, index) => (
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
                <button onClick={handleSubmit} disabled={!isAllowedTime}>{isAllowedTime ? "Make a wish" : "Comeback at 11:11"}</button>
            </div>
        </div>
    );
};

export default ElevenEleven;
