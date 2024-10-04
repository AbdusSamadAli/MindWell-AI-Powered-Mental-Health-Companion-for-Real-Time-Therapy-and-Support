import React, { useEffect } from 'react';
import axios from 'axios';

const Logout = () => {
    useEffect(() => {
        const handleLogout = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    await axios.post('/api/logout', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    localStorage.removeItem('token');
                    window.location.href = '/login'; 
                } catch (error) {
                    console.error('Logout failed', error);
                }
            }
        };

        handleLogout();
    }, []);

    return <p>Logging out...</p>;
};

export default Logout;


