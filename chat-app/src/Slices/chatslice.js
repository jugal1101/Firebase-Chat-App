import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../Firebase/firebaseConfig";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const sendMessages = createAsyncThunk(
  "chat/send",
  async ({ sender, receiver, message }) => {
    const users = [sender, receiver].sort();
    const docId = `${users[0]}_${users[1]}`;
    const chatId = Date.now().toString();

    await setDoc(doc(db, "chatRoom", docId, "chats", chatId), {
      chatId,
      sender,
      receiver,
      message,
      createdAt: new Date().toISOString(),
    });

    return { chatId, sender, receiver, message };
  }
);

export const updateMessage = createAsyncThunk(
  "chat/update",
  async ({ chatId, sender, receiver, newMessage }) => {
    const users = [sender, receiver].sort();
    const docId = `${users[0]}_${users[1]}`;

    const ref = doc(db, "chatRoom", docId, "chats", chatId);

    await updateDoc(ref, {
      message: newMessage,
      updatedAt: new Date().toISOString(),
    });

    return { chatId, newMessage };
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/delete",
  async ({ chatId, sender, receiver }) => {
    const users = [sender, receiver].sort();
    const docId = `${users[0]}_${users[1]}`;

    const ref = doc(db, "chatRoom", docId, "chats", chatId);
    await deleteDoc(ref);

    return { chatId };
  }
);

let unsubscribeListener = null;

export const startChatListener = createAsyncThunk(
  "chat/listen",
  async ({ sender, receiver }, { dispatch }) => {
    const users = [sender, receiver].sort();
    const docId = `${users[0]}_${users[1]}`;

    if (unsubscribeListener) unsubscribeListener(); // avoids double-listening

    const chatsRef = collection(db, "chatRoom", docId, "chats");
    const q = query(chatsRef, orderBy("createdAt"));

    unsubscribeListener = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => msgs.push(doc.data()));

      dispatch(setChats(msgs));
    });

    return true;
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    isLoading:false,
    error:null
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.isLoading=false;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const msg = state.chats.find((m) => m.chatId === action.payload.chatId);
        if (msg) msg.message = action.payload.newMessage;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.chats = state.chats.filter(
          (msg) => msg.chatId !== action.payload.chatId
        );
      });
  },
});

export const { setChats } = chatSlice.actions;
export default chatSlice.reducer;