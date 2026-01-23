// src/context/SellerAuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCredentials, logout as logoutAction } from "../store/authSlice";
import api from "../api/axios";

export const SellerAuthContext = createContext();

export const SellerAuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // 1. Get fresh token
                    const token = await getIdToken(currentUser);
                    
                    // 2. Sync with Backend (Check if seller exists in MongoDB)
                    // Note: Ensure your backend '/auth/sync' or specific seller endpoint handles this
                    const response = await api.post("/auth/sync-seller", { 
                        // You might need a specific endpoint for sellers to ensure they have the right role
                        token 
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const sellerData = response.data.data;

                    // 3. Update Redux Store
                    dispatch(setCredentials({ 
                        user: sellerData, 
                        token: token 
                    }));

                } catch (error) {
                    console.error("Sync failed:", error);
                    dispatch(logoutAction());
                }
            } else {
                dispatch(logoutAction());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <SellerAuthContext.Provider value={{ loading }}>
            {!loading && children}
        </SellerAuthContext.Provider>
    );
};