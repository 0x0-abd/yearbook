import React, { useState, useContext } from 'react';
import { motion, useIsPresent } from 'framer-motion';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserContext } from '../config/userContext';
import { Button } from '../components/ui/button';
import GoogleIcon from '../assets/GoogleIcon';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../config/publicRequest';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState('');
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const isPresent = useIsPresent();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const allowedDomain = '@lnmiit.ac.in';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const userData = result.user;
      // if (userData.email.endsWith(allowedDomain) || true) {
      //   setError('');
      //   console.log("sending login req")
      //   const accountDetails = await publicRequest.get('/api/login');
      //   console.log(accountDetails.data);
      //   setUser({
      //     name: userData.displayName,
      //     email: userData.email,
      //     photoURL: accountDetails.data.user.photoURL,
      //     quote: accountDetails.data.quote,
      //     friends: accountDetails.data.user.friends
      //   });
      //   if (accountDetails.data.verified) {
      //     navigate('/yearbook')
      //   } else {
      //     navigate('/onboarding')
      //   }
      //   // console.log('Google User:', userData);

      // } else {
      //   await signOut(auth);
      //   setError(`Sign-in allowed only College mail ids ending with: ${allowedDomain}`);
      // }
    } catch (error) {
      console.error('Google Login Error:', error);
      setError('Sign in with college id only');
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-2 pt-20 relative overflow-hidden md:p-4 md:pt-20">
      {/* Scattered and animated tech-inspired background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(100,150,255,0.1)" />
            <stop offset="100%" stopColor="rgba(200,100,255,0.1)" />
          </linearGradient>
        </defs>

        {/* Base layer with gradient */}
        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* Scattered and animated tech elements */}
        <motion.path
          cx="15%"
          cy="85%"
          d="M0 50 Q 25 0, 50 50 T 100 50"
          stroke="rgba(100,200,255,0.2)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M100 20 Q 75 70, 50 20 T 0 20"
          stroke="rgba(200,100,255,0.2)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        <motion.circle
          cx="15%"
          cy="25%"
          r="20"
          fill="rgba(100,200,255,0.05)"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="85%"
          cy="75%"
          r="40"
          fill="rgba(200,100,255,0.05)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="70%"
          y="20%"
          width="60"
          height="60"
          fill="rgba(150,150,255,0.05)"
          animate={{
            rotate: [0, 180, 360],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.polygon
          points="30,10 50,30 30,50 10,30"
          fill="rgba(255,200,100,0.05)"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Digital nodes with connections */}
        <g>
          <motion.circle cx="10%" cy="20%" r="2" fill="rgba(100,200,255,0.5)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle cx="20%" cy="75%" r="2" fill="rgba(200,100,255,0.5)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
          />
          <motion.circle cx="50%" cy="50%" r="2" fill="rgba(255,200,100,0.5)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity }}
          />
          <motion.line x1="70%" y1="20%" x2="50%" y2="50%" stroke="rgba(150,150,255,0.2)" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.line x1="85%" y1="15%" x2="50%" y2="50%" stroke="rgba(150,150,255,0.2)" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          />
        </g>
      </svg>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="text-center z-10"
      >
        <motion.h1
          variants={fadeIn}
          className="text-3xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
        >
          Digital Yearbook 📔
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className="text-base md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto"
        >
          "An odyssey of sleepless nights, endless codes,
           and boundless dreams."
        </motion.p>

        <motion.div
          variants={fadeIn}
          className="mb-8 flex flex-col items-center justify-center"
        >
          {!user ? (
            <Button
              className="bg-purple-200 hover:bg-purple-300 text-gray-800 font-bold py-3 px-3 rounded-full flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-transform duration-200"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              <span className="text-xl md:text-2xl">Sign in with College Account</span>

            </Button>
          ) : (
            <Button
              className="bg-red-200 hover:bg-red-300 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-transform duration-200"
              onClick={handleGoogleLogout}
            >
              <GoogleIcon />
              <span className="text-2xl">Sign Out</span>

            </Button>
          )}
          {error && <span className="text-md text-red-500 my-2">{error}</span>}
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-xl border border-blue-300 border-opacity-30"
            >
              <img
                src={`/api/placeholder/150/150`}
                alt={`Graduate ${index}`}
                className="w-20 h-20 md:w-32 md:h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md"
              />
              <p className="text-sm text-blue-200 italic">
                "Innovation distinguishes between a leader and a follower."
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="fixed top-0 left-0 right-0 bottom-0 bg-purple-800 z-40"
      />
    </div>
  );
};

export default Home;