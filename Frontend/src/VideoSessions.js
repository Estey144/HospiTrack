import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ArrowLeftCircle } from 'lucide-react';

const VideoSessions = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom right, #eef2f3, #8e9eab)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
      }}>
        <Video size={48} color="#4f46e5" />
        <h1 style={{ fontSize: '28px', margin: '20px 0 10px', color: '#333' }}>
          Video Session
        </h1>
        <p style={{ fontSize: '16px', color: '#555' }}>
          {currentUser?.name ? `Hello ${currentUser.name}, ` : ''}this feature will be available soon.
        </p>
        <button
          onClick={() => navigate('/patient-dashboard')}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeftCircle size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default VideoSessions;
