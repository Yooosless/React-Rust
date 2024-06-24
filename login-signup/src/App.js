import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup'; // Adjust the import path as needed
import Main from './components/mainPage/Main'; // Create this component for the welcome page
import PickupLine from './components/navbar/PickupLine'
import ElevenEleven from './components/navbar/ElevenEleven'
import Roasts from './components/navbar/Roasts'
import ProtectedRoute from './components/LoginSignup/ProtectedRoute'; // Import the ProtectedRoute component


const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/loginSignup" element={<LoginSignup />} />
                <Route path="/" element={<ProtectedRoute element={Main} />} />
                <Route path="/pickupLine" element={<ProtectedRoute element={PickupLine} />} />
                <Route path="/elevenEleven" element={<ProtectedRoute element={ElevenEleven} />} />
                <Route path='/roasts' element={<ProtectedRoute element={Roasts} />} />
                
            </Routes>
        </Router>
    );
};

export default App;