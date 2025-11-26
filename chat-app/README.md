📱 React Firebase Chat App

A real-time chat application built using React, Redux Toolkit, and Firebase Authentication + Firestore.
Supports 1-to-1 chatting, message editing, message deletion, and responsive UI similar to WhatsApp.

🚀 Features
🔐 Authentication

User signup & login

Firebase Authentication

Stores user details in Firestore

💬 Messaging

Real-time chat using Firestore listeners

Sender & receiver message bubbles

Messages stay stored even after refresh or navigation

Double-click message options: Edit or Delete

Users can delete only their own messages

🧑‍🤝‍🧑 Contacts

Shows all registered users

Click on a user to start chatting

Logged-in user cannot see themselves in contacts

🎨 UI Features

Fully responsive

Clean WhatsApp-style chat bubbles

Sender on right (blue), receiver on left (white)

Home page with profile avatar & logout

Chat backend synced with Firestore collections

🛠️ Tech Stack
Frontend

React

Redux Toolkit

React Router

CSS

Backend / Database

Firebase Authentication

Firestore Database

📂 Folder Structure
project/
│
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── ChatPage/
│   │   │   ├── ChatPage.jsx
│   │   │   └── ChatPage.css
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       └── Auth.css
│   │
│   ├── Firebase/
│   │   └── firebaseConfig.js
│   │
│   ├── Slices/
│   │   ├── userslice.js
│   │   └── messageslice.js
│   │
│   ├── App.js
│   └── index.js
│
└── package.json

🔧 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/react-firebase-chatapp.git
cd react-firebase-chatapp

2️⃣ Install Dependencies
npm install

3️⃣ Setup Firebase

Go to: https://console.firebase.google.com

Create a new Firebase project

Enable Email/Password Authentication

Create a Firestore database

Copy your Firebase config

Inside src/Firebase/firebaseConfig.js:

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "YOUR AUTH DOMAIN",
  projectId: "YOUR PROJECT ID",
  storageBucket: "YOUR STORAGE BUCKET",
  messagingSenderId: "YOUR SENDER ID",
  appId: "YOUR APP ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

🗄️ Firestore Structure
users (collection)
   └── userId
        ├── name
        ├── email
        └── createdAt

messages (collection)
    └── chatId (user1Id_user2Id)
         └── messageId
              ├── senderId
              ├── receiverId
              ├── text
              ├── createdAt
              └── edited (true/false)

▶️ Run the Project
npm start


The app will run at:

http://localhost:3000

 ✨ ##Demo  


https://github.com/user-attachments/assets/54f3e619-b390-46c7-bc40-909717df00b7









Features to Add (Future Improvements)

Last message preview on contact list

Online/offline user status

Image sending

Typing indicator

Push notifications
