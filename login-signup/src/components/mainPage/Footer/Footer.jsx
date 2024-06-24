import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Footer.css'; // Optional: create a CSS file for styling

const Footer = () => {
    const [quote, setQuote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isMounted = useRef(false);
    const [author, setAuthor] = useState('');

    useEffect(() => {
        if (isMounted.current) return; // Skip if already mounted
        isMounted.current = true;

        const fetchQuote = async () => {
            try {
                //console.log('Fetching quote...');
                const token = localStorage.getItem('token'); 

                const response = await axios.get('http://localhost:8080/api/quote', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Fetching quote...',response.data);

                if (response.data) {
                    setQuote(response.data.quote);
                    setAuthor(response.data.author);
                    setLoading(false);
                } else {
                    setError('Quote not found');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching the quote:', error);
                setError('Error fetching the quote');
                setLoading(false);
            }
        };

        fetchQuote();
    }, []);

    if (loading) {
        return (
            <footer className="footer">
                <p>Loading quote...</p>
            </footer>
        );
    }

    if (error) {
        return (
            <footer className="footer">
                <p>{error}</p>
            </footer>
        );
    }

    return (
        <footer className="footer">
            <p>{quote}</p>
            <p className="author">~{author}</p> {/* Add class for author */}
        </footer>
    );
};

export default Footer;
