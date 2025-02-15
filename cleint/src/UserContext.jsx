import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // Define the async function inside the useEffect hook
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/profile', { withCredentials: true });
        setUser(data); // Set the fetched data into the user state
        setReady(true)
        // console.log(data)
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (!user) {
      fetchUserProfile(); // Call the async function to fetch user profile
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
