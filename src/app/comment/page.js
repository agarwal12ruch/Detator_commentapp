"use client";
import { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";

// Initialize Socket.IO connection
const socket = io("http://localhost:3001");

export default function CommentPage() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch initial comments from the server on component mount
    async function fetchComments() {
      const res = await axios.get("http://localhost:3001/api/comments");
      setComments(res.data);
    }
    fetchComments();

    // Listen for new comments via Socket.IO
    socket.on("newComment", (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    // Cleanup: remove the socket listener on unmount
    return () => {
      socket.off("newComment");
    };
  }, []);

  const handlePostComment = async () => {
    const username = sessionStorage.getItem("username");
    if (!username || !newComment) return;

    const commentData = {
      username,
      content: newComment,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add the new comment to the state
    setComments((prevComments) => [...prevComments, commentData]);

    // Send the new comment to the server
    await axios.post("http://localhost:3001/api/comments", commentData);

    // Emit the new comment to other clients via Socket.IO
    socket.emit("newComment", commentData);

    // Clear the input field
    setNewComment("");
  };

  return (
    <Box>
      <TextField
        label="Post a comment"
        variant="outlined"
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button onClick={handlePostComment} variant="contained" fullWidth>
        Post Comment
      </Button>
      <List>
        {comments.map((comment, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${comment.username}: ${comment.content}`}
              secondary={new Date(comment.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
