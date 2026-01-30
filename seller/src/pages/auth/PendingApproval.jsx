import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const PendingApproval = () => {
    // 1. Destructure handleLogout from the hook
    const { handleLogout } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
                    <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
                <p className="text-gray-600 mb-6">
                    Your email has been verified and your application has been submitted. 
                    <br/><br/>
                    <strong>The Admin team is currently reviewing your details.</strong>
                    <br/>
                    You will be able to access the dashboard once your store is approved.
                </p>
                
                {/* 2. Use handleLogout here */}
                <button 
                    onClick={handleLogout} 
                    className="text-indigo-600 hover:text-indigo-500 font-medium underline"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default PendingApproval;