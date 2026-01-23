// client/src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase Listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // 1. Get Fresh Token
                    const token = await firebaseUser.getIdToken();
                    
                    // 2. Sync with Backend (Get Role, Name, Wishlist from MongoDB)
                    // Note: Ensure backend has /auth/sync endpoint ready
                    const response = await api.post("/auth/sync", { 
                        idToken: token 
                    });

                    // 3. Set User Data
                    setUser({ ...response.data.data, ...firebaseUser });
                } catch (error) {
                    console.error("Auth Sync Failed:", error);
                    // If sync fails, force logout to avoid inconsistent state
                    // auth.signOut(); 
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};