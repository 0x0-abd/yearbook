import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { UserContext } from '../config/userContext';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../config/publicRequest';

const QuoteForm = () => {
  const [quote, setQuote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

  const isPresent = useIsPresent()
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/');
      } else {
        setIsEditing(!!user.quote);
        setQuote(user.quote || '');
        setIsLoading(false);
      }
    }, 500); // Short delay to prevent flash of content

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // onSubmit(quote);
    try {
      const response = await publicRequest.post('/api/quote', {
        email: user.email,
        quote
      })
      if (response.data.status === 'ok') {
        setUser((prev) => ({ ...prev, quote }))
        navigate('/yearbook')
      } else {
        console.log(response.data)
      }
    } catch (err) {
      console.log(err)
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  const onBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white px-5 md:px-20">
        <div className="flex items-center justify-center">
          <div className="bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white px-5 md:px-20">
          <div className="flex items-center justify-center">
            <Alert variant="destructive" className="w-96">
              <AlertDescription>
                Please log in to access this page
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="fixed top-0 left-0 right-0 bottom-0 bg-purple-800 z-40"
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white px-5 md:px-20">
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key="quote-form"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96"
            >
              <Button
                variant="ghost"
                className="mb-4 text-white hover:text-white/80"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-medium">{user.rollNumber}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Quote
                    </label>
                    <Textarea
                      placeholder="Enter your yearbook quote..."
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      className="bg-sky-500 bg-opacity-25 text-white min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditing ? 'Save Changes' : 'Create Quote'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </>
  );
};

export default QuoteForm;