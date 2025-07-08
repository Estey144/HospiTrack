import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rooms.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/rooms`)
      .then(res => setRooms(res.data))
      .catch(() => alert('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading rooms...</p>;

  return (
    <div className="rooms-page">
      <h2>Room Availability</h2>
      <div className="room-grid">
        {rooms.length === 0 ? (
          <p className="no-data">No rooms available.</p>
        ) : (
          rooms.map(room => (
            <div key={room.id} className={`room-card ${room.status.toLowerCase()}`}>
              <h3>Room #{room.room_number}</h3>
              <p><strong>Type:</strong> {room.type}</p>
              <p><strong>Status:</strong> {room.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;