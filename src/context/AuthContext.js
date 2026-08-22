// import React, { createContext, useState, useEffect } from 'react';
// import apiClient from '../utils/apiClient';
// import SplashScreen from '../components/common/SplashScreen';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
// const [authToken, setAuthToken] = useState(localStorage.getItem('token'));  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
//   const [userName, setUserName] = useState(localStorage.getItem('userName'));
//   const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

//   // Set default to true for immediate UI rendering
//   const [isSubmissionOpen, setIsSubmissionOpen] = useState(true);
//   const [isAuthReady, setIsAuthReady] = useState(false);

//   useEffect(() => {
//     const checkAuthAndSubmissionStatus = async () => {
//       console.log('AuthContext: Initializing...');
//       const storedToken = localStorage.getItem('token');
//       const storedRole = localStorage.getItem('userRole');
//       const storedUserName = localStorage.getItem('userName');
//       const storedUserEmail = localStorage.getItem('userEmail'); // Add this!

//       if (storedToken) {
//         setAuthToken(storedToken);
//         setUserRole(storedRole);
//         setUserName(storedUserName);
//         setUserEmail(storedUserEmail); // Add this!
//         console.log('AuthContext: Stored token found and set.');
//       } else {
//         setAuthToken(null);
//         setUserRole(null);
//         setUserName(null);
//         console.log('AuthContext: No stored token found.');
//       }

//       try {
//         console.log('AuthContext: Attempting to fetch submission status...');
//         const response = await apiClient.get('/settings/submission-status');

//         if (response.data.success) {
//           // --- FOR TESTING PURPOSES ---
//           // We log the real status from the server but FORCE the state to true
//           console.log('AuthContext: Server status is:', response.data.isSubmissionOpen);
//           setIsSubmissionOpen(true);
//           console.warn('AuthContext: isSubmissionOpen FORCED TO TRUE FOR TESTING');
//           // ----------------------------
//         } else {
//           console.error('AuthContext: Failed to fetch submission status:', response.data.message);
//           setIsSubmissionOpen(true); // Default to true even on failure for testing
//         }
//       } catch (error) {
//         console.error('AuthContext: Error fetching submission status:', error);
//         setIsSubmissionOpen(true); // Default to true on error for testing
//       } finally {
//         setIsAuthReady(true);
//         console.log('AuthContext: Initial setup complete. isAuthReady set to TRUE.');
//       }
//     };

//     checkAuthAndSubmissionStatus();
//   }, []);

//   const handleLogin = (newToken, newRole, newName, newEmail) => {
//     localStorage.setItem('token', newToken);
//     localStorage.setItem('userRole', newRole);
//     localStorage.setItem('userName', newName);
//     localStorage.setItem('userEmail', newEmail);

//     setAuthToken(newToken);
//     setUserRole(newRole);
//     setUserName(newName);
//     setUserEmail(newEmail);
//     setUserEmail(newEmail);
//     console.log('AuthContext: User logged in.');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userEmail');

//     setAuthToken(null);
//     setUserRole(null);
//     setUserName(null);
//     setUserEmail(null);
//     console.log('AuthContext: User logged out.');
//   };

//   const value = {
//     authToken,
//     userRole,
//     userName,
//     userEmail,
//     isLoggedIn: !!authToken,
//     isAuthReady,
//     isSubmissionOpen, // This is now forced to true
//     handleLogin,
//     handleLogout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {isAuthReady ? children : <SplashScreen />}
//     </AuthContext.Provider>
//   );

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {/* {isAuthReady ? children : (
// //         <div className="flex h-screen items-center justify-center">
// //             <div className="text-center">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
// //                 <p className="text-gray-600 font-medium">Loading JEMPA Portal...</p>
// //             </div>
// //         </div>
// //       )} */}
// //       {isAuthReady ? children : (
// //         <div className="flex h-screen items-center justify-center bg-blue-600 text-white">
// //           <h1 className="text-3xl font-bold">EMPA Portal</h1>
// //           <p className="mt-4">Initializing, please wait...</p>
// //         </div>
// //       )}

// //     </AuthContext.Provider>
// //   );
// };

import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import SplashScreen from '../components/common/SplashScreen';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));  
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  // ✅ FIXED: Now defaults to false to prevent UI flickering
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false); 
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isConferenceStatusLoading, setIsConferenceStatusLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndSubmissionStatus = async () => {
      console.log('AuthContext: Initializing...');
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');
      const storedUserEmail = localStorage.getItem('userEmail'); 

      if (storedToken) {
        setAuthToken(storedToken);
        setUserRole(storedRole);
        setUserName(storedUserName);
        setUserEmail(storedUserEmail); 
        console.log('AuthContext: Stored token found and set.');
      } else {
        setAuthToken(null);
        setUserRole(null);
        setUserName(null);
        console.log('AuthContext: No stored token found.');
      }

      try {
        console.log('AuthContext: Attempting to fetch submission status...');
        setIsConferenceStatusLoading(true);
        
        // Fetch real data from your backend
        const response = await apiClient.get('/settings/submission-status');

        if (response.data.success) {
          // Check the boolean coming from the backend
          const isOpen = response.data.isSubmissionOpen === true || response.data.data === true;
          console.log('AuthContext: REAL Server status is:', isOpen);
          setIsSubmissionOpen(isOpen); 
        } else {
          console.warn('AuthContext: Failed to fetch submission status, defaulting to FALSE.');
          setIsSubmissionOpen(false); 
        }
      } catch (error) {
        console.error('AuthContext: Error fetching submission status:', error);
        setIsSubmissionOpen(false); // Failsafe
      } finally {
        setIsConferenceStatusLoading(false);
        setIsAuthReady(true);
        console.log('AuthContext: Initial setup complete. isAuthReady set to TRUE.');
      }
    };

    checkAuthAndSubmissionStatus();
  }, []);

  const handleLogin = (newToken, newRole, newName, newEmail) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('userName', newName || '');
    localStorage.setItem('userEmail', newEmail || '');

    setAuthToken(newToken);
    setUserRole(newRole);
    setUserName(newName);
    setUserEmail(newEmail);
    console.log('AuthContext: User logged in.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    setAuthToken(null);
    setUserRole(null);
    setUserName(null);
    setUserEmail(null);
    console.log('AuthContext: User logged out.');
  };

  const value = {
    authToken,
    userRole,
    userName,
    userEmail,
    isLoggedIn: !!authToken,
    isAuthReady,
    isSubmissionOpen,
    isConferenceStatusLoading,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isAuthReady ? children : <SplashScreen />}
    </AuthContext.Provider>
  );
};