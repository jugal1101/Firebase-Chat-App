import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import SignIn from "./components/Auth/SignIn";
import Home from "./components/home/home";
import ChatPage from "./components/Chat/chat";

function App() {
  return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
  );
}

export default App;
