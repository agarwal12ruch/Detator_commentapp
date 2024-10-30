// src/app/login/page.js
"use client";

import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+

import { TextField, Button, Box, Typography, Container, Paper } from "@mui/material";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const handleLogin = async() => {
    if (!username) {
      setError("Username is required");
      return;
    }
    try {
      const response= await axios.post("http://localhost:3001/api/login",{username});
      sessionStorage.setItem("username",username);
      sessionStorage.setItem("sessionId", response.data.sessionId);
      // setError("");
      alert("Login successful!");
      router.push("/comment");
      // window.location.reload();
      
    } catch (err) {
      console.error("Login failed:", err);
     // setError("Login failed. Please try again.");
    }
  };

  return (
    
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
       
    
      }}
    >
    
    <Typography level="h2" sx={{ fontSize: '35px', mb: 8, whiteSpace:"nowrap", fontFamily:"Unlock, serif",fontWeight:"600",fontStyle:"normal"}}>Welcome To Comment Arena</Typography>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: "100%" }}>
        
      <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  sx={{
    width: "100%",
    height: "auto",
  }}
>
  <Box
    component="img"
    src="/user.jpg" 
    alt="Login Image"
    sx={{
      width: "30%",  
      height: "auto",
      mb:"15px"
    }}
  />
</Box>

        
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          onClick={handleLogin}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "secondary.main",
            color: "white",
            "&:hover": {
              bgcolor: "rgb(165 97 238)",
            },
          }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
}
