import { auth } from "../config/firebase";

// Function to get current user's JWT (ID Token)
const getIdToken = async () => {
  const user = auth.currentUser;

  if (user) {
    // Get the current user's ID token
    const idToken = await user.getIdToken();
    return idToken;
  } else {
    throw new Error("User is not authenticated");
  }
};

export const sendAuthenticatedRequest = async (url, options = {}) => {
    try {
      const idToken = await getIdToken();
  
      // Include the ID token in the Authorization header
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${idToken}`, // Set the Authorization header
        'Content-Type': 'application/json',
      };
  
      // Send the request with the updated headers
      const response = await fetch(url, {
        ...options,
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending authenticated request:', error);
      throw error;
    }
  };