package com.edigest.HospiTrack.service;


import com.edigest.HospiTrack.entity.Room;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class RoomService {

    private final JdbcTemplate jdbcTemplate;

    public RoomService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Room> roomRowMapper = new RowMapper<Room>() {
        @Override
        public Room mapRow(ResultSet rs, int rowNum) throws SQLException {
            Room room = new Room();
            room.setId(rs.getString("id"));
            room.setRoomNumber(rs.getString("room_number"));
            room.setType(rs.getString("type"));
            room.setStatus(rs.getString("status"));
            return room;
        }
    };

    public List<Room> getAllRooms() {
        String sql = "SELECT id, room_number, type, status FROM Rooms";
        return jdbcTemplate.query(sql, roomRowMapper);
    }

    public Room getRoomById(String id) {
        String sql = "SELECT id, room_number, type, status FROM Rooms WHERE id = ?";
        List<Room> rooms = jdbcTemplate.query(sql, roomRowMapper, id);
        return rooms.isEmpty() ? null : rooms.get(0);
    }

    public Room saveRoom(Room room) {
        if (room.getId() != null && getRoomById(room.getId()) != null) {
            // Update existing room
            String sql = "UPDATE Rooms SET room_number = ?, type = ?, status = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    room.getRoomNumber(),
                    room.getType(),
                    room.getStatus(),
                    room.getId()
            );
        } else {
            // Insert new room
            String sql = "INSERT INTO Rooms (id, room_number, type, status) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    room.getId(),
                    room.getRoomNumber(),
                    room.getType(),
                    room.getStatus()
            );
        }
        return room;
    }

    public void deleteRoom(String id) {
        String sql = "DELETE FROM Rooms WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
