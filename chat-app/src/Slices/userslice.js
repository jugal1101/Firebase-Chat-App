import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { provider, auth, db } from "../Firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";

const initializeState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

export const SignUp = createAsyncThunk(
  "user/signup",
  async ({ email, password, name }) => {
    const existingUser = await getDoc(doc(db, "users", email));
    if (existingUser.exists()) {
      throw new Error("User already exists");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = {
      name: name,
      email: userCredential.user.email,
      uid: userCredential.user.uid,
    };
    await setDoc(doc(db, "users", email), user);
    return { ...user, success: true };
  }
);

export const SignIn = createAsyncThunk(
  "user/signin",
  async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", email));
    const userData = userDoc.exists() ? userDoc.data() : { email };
    return { ...userData, success: true };
  }
);

export const fetchUsers = createAsyncThunk("user/read", async () => {
  const querySnapShot = await getDocs(collection(db, "users"));
  const users = querySnapShot.docs.map((snap) => snap.data());
  return users;
});

const userSlice = createSlice({
  name: "user",
  initialState: initializeState,
  reducers: {
    getUser: (state) => {
      try {
        state.currentUser = JSON.parse(localStorage.getItem("user"));
      } catch {
        state.currentUser = null;
      }
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        const already = state.users.find((u) => u.email === action.payload.email);
        if (!already) state.users.push(action.payload);
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.currentUser = action.payload;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error("🔥 Signup failed:", action.error.message);
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(SignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(SignIn.fulfilled, (state, action) => {
        const user = action.payload;
        const isCheckUser = state.users.find((e) => e.email === user.email);
        if (!isCheckUser) {
          state.users.push(user);
        }
        localStorage.setItem("user", JSON.stringify(user));
        state.currentUser = user;
        state.isLoading = false;
      })
      .addCase(SignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "signin failed!!";
        console.error("🔥 Signin failed:", action.error);
      });
  },
});

export const { getUser, logout } = userSlice.actions;
export default userSlice.reducer;
