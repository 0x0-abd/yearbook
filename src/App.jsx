import React, { useState, useEffect, useContext } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { sendAuthenticatedRequest } from './lib/firebaseUtils';
import { AnimatePresence, } from "framer-motion";
import { useLocation, useRoutes, Link, useNavigate } from "react-router-dom";
import { UserContext } from './config/userContext';
import Home from './pages/Home';
import OnboardingPopups from './pages/Onboarding';
import Friends from './pages/Friends';
import AnimatedTabs from './assets/AnimatedNavbar';
import Yearbook from './pages/Yearbook';
import { publicRequest } from './config/publicRequest';
import QuoteForm from './assets/QuoteForm';
import QuoteDetails from './assets/QuoteDetails';

function App() {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const allowedDomain = '@lnmiit.ac.in';

  const element = useRoutes([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/friends",
      element: <Friends />
    },
    {
      path: "/onboarding",
      element: <OnboardingPopups />
    },
    {
      path: "/yearbook",
      element: <Yearbook />,
      children: [
        {
          path: ":id",
          element: <QuoteDetails />
        }
      ]
    },
    {
      path: "/quote",
      element: <QuoteForm />
    }
  ]);

  const location = useLocation();
  // const isYearbookRoute = location.pathname.startsWith('/yearbook');
  const isYearbookRoute = false;

  if (!element) return null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log(user.photoURL);
      if (user && (user.email.endsWith(allowedDomain))) {
        // console.log("sending main page login req");
        const accountDetails = await publicRequest.get('/api/login');
        setUser({
          id: accountDetails.data.user._id,
          name: user.displayName,
          email: user.email,
          photoURL: accountDetails.data.user.photoURL,
          quote: accountDetails.data.quote,
          friends: accountDetails.data.user.friends
        });
        if (accountDetails.data.verified) {
          navigate('/yearbook')
        } else {
          navigate('/onboarding')
        }
        // console.log('Google User:', accountDetails.data);
        // console.log(accountDetails);
        // console.log(location.pathname + " " + isYearbookRoute)
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // const getAuthData = async () => {
  //   try {
  //     // console.log(user)
  //     const result = await sendAuthenticatedRequest('http://localhost:8080/api/home');
  //     console.log(result);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // }

  return (
    <>
      <>
        <AnimatedTabs />
      </>
      {isYearbookRoute ? (
        // Render without animation for Yearbook routes
        React.cloneElement(element, { key: location.pathname })
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
      )}
    </>
  );
};

export default App
