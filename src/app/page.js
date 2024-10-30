"use client";
import { useState,useEffect } from "react";
import LoginPage from "./login/page";
import CommentPage from "./comment/page";
import styles from "./page.module.css";

export default function Home() {
  const [isLoggedIn, setisLoggedIn]=useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
     sessionStorage.clear();
    const username = sessionStorage.getItem("username");
    setisLoggedIn(!!username); 
    setLoading(false);
  }, []);
  const handleLogin=(username)=>{
    sessionStorage.setItem("username",username);
    setisLoggedIn(true);
  }
  return (
    <>
    {isLoggedIn?(<CommentPage/>):(<LoginPage onLogin={handleLogin}/>)}
    </>
  );
}
