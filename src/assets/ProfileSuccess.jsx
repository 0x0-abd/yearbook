import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-5"
    >
      <div className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md mx-4">
        <motion.div
          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"
          variants={checkmarkVariants}
        >
          <Check className="w-8 h-8 text-green-100" />
        </motion.div>

        <motion.h2 
          className="text-2xl font-bold text-gray-100 mb-2"
          variants={textVariants}
        >
          Profile Created Successfully!
        </motion.h2>

        <motion.p 
          className="text-gray-300 text-center"
          variants={textVariants}
        >
          Redirecting you to your new profile...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SuccessAnimation;