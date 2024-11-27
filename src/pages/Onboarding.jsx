import React, { useState, useCallback, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Camera, PencilIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { UserContext } from '../config/userContext';
import { publicRequest } from '../config/publicRequest';
import { useNavigate } from 'react-router-dom';
import SuccessAnimation from '../assets/ProfileSuccess';

const OnboardingPopups = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const isPresent = useIsPresent();
  const [step, setStep] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const resetCropState = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setOriginalImage(reader.result);
        resetCropState();
        setStep(1); // Move to cropping step
      };
      reader.readAsDataURL(file);
    }
  };

  // useEffect(() => {
  //   if(user) setOriginalImage(user.photoURL)
  // }, [user])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!originalImage || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = originalImage;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          // Convert blob to a File object
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          const blobURL = URL.createObjectURL(blob);
          // Resolve with both the blob URL for preview and the File for upload
          resolve({ blobURL, file });
        }
      }, 'image/jpeg');
    });
  }, [croppedAreaPixels, profilePicture]);

  const handleCropConfirm = async () => {
    const { blobURL, file } = await createCroppedImage();
    setProfilePicture(blobURL);
    setProfilePictureFile(file);
    setStep(2);
  };

  const handleNext = () => {
    if (step === 0 && !profilePicture) setStep(step + 2);
    else setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 2 && !profilePicture) {
      setStep(step - 2);
    } else {
      if (step === 1) {
        // Reset crop state when going back to file selection
        setProfilePicture(originalImage);
        resetCropState();
      }
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    setStep(5);
  };

  const handleSubmit = async () => {
    // console.log('Submitted:', { profilePicture, name, description });
    // Here you would typically send this data to your backend
    // setStep(4);
    const formData = new FormData();

    if (profilePictureFile) {
      // console.log('Profile Picture Details:', {
      //   name: profilePicture.name,
      //   type: profilePicture.type,
      //   size: profilePicture.size
      // });
      formData.append('file', profilePictureFile);
    }
    formData.append('name', name);
    formData.append('email', user.email);
    // formData.append('quote', user.quote);
    // formData.append('description', description);
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }
    try {
      const response = await publicRequest.put('/api/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.status === 'success') {
        if(quote!==user.quote) {
          const quote_response = await publicRequest.post(`/api/quote`, {
            email: user.email,
            quote
          })
          if(quote_response.data.status === 'ok') setUser((prev) => ({ ...prev, quote }))
        }
        // console.log(response.data)
        setUser((prev) => ({
          ...prev,
          name: response.data.data.user.name,
          photoURL: response.data.data.user.photoURL
        }))
        setStep(5);
        // setTimeout(() => {
        //   navigate('/yearbook'); // Replace with your target route
        // }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
      if (user.quote) {
        setQuote(user.quote);
      }
    }
  }, [user]);

  useEffect(() => {
    if(step === 2 && user && !user.canPost) {
      // console.log(user.canPost);
      handleSubmit();
    }
  }, [step, user])

  return (
    <div className='min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white px-5 md:px-20'>
      <div className='mx-auto p-4 text-center'>
        <h1 className="text-4xl font-bold" onClick={() => console.log(user)}>Update Details</h1>
      </div>
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-2xl font-bold mb-4">Profile Picture</h2>
              <div className="mb-4">
                <label className="cursor-pointer flex flex-col items-center justify-center w-48 h-48 bg-gray-200 rounded-full mx-auto relative group">
                  {profilePicture ? (
                    <>
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full " />
                      <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2 opacity-100 outline-double group-hover:opacity-100 transition-all duration-300">
                          <PencilIcon className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                    </>
                  ) : (user &&
                    <>
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full " />
                      <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2 opacity-100 outline-double group-hover:opacity-100 transition-all duration-300">
                          <PencilIcon className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                    </>
                  )}
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              {/* <Button onClick={handleNext} className="w-full" disabled={!profilePicture}>Next</Button> */}
              {user && user.canPost ? <Button onClick={handleNext} className="w-full">Next</Button> 
              :
              <Button onClick={handleSubmit} className='w-full mt-2'>Submit</Button>}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96 "
            >
              <h2 className="text-2xl font-bold mb-4">Crop Your Image</h2>
              <div className="relative w-full h-96 mb-4">
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.01}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-full mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleBack} variant="outline" className="flex-1 text-white bg-transparent">Back</Button>
                {user && user.canPost ? (
                  <Button onClick={handleCropConfirm} className="flex-1">Confirm Crop</Button>
                ) : (
                  <Button onClick={handleCropConfirm} className="flex-1">Submit</Button>
                )}
              </div>
            </motion.div>
          )}

          {/* {step === 2 && (
            <motion.div
              key="step2"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-2xl font-bold mb-4">Your Name</h2>
              <Input
                type="text"
                className="bg-sky-500 bg-opacity-25 mb-4 text-xl"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleBack} variant="outline" className="flex-1 text-white bg-transparent">Back</Button>
                <Button onClick={handleNext} className="flex-1">Next</Button>
              </div>
            </motion.div>
          )} */}

          {step === 2 && (
            <motion.div
              key="step3"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-2xl font-bold mb-4">Quote</h2>
              <Textarea
                placeholder="Tell us about yourself"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="bg-sky-500 bg-opacity-25 mb-4 text-xl"
              />
              <div className="flex gap-2">
                <Button onClick={handleBack} variant="outline" className="flex-1  text-white bg-transparent">Back</Button>
                {/* <Button onClick={handleSkip} variant="outline" className="flex-1 text-white bg-blue-600 bg-opacity-50">Skip</Button> */}
                <Button onClick={handleSubmit} className="flex-1">Finish</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" bg-gray-800 bg-opacity-50 border-blue-800 border-2 p-6 rounded-lg shadow-lg w-96 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">All Done!</h2>
              <p>Thank you for completing the onboarding process.</p>
              <div className="mt-4">
                <img src={profilePicture} alt="Profile" className="w-48 h-48 object-cover rounded-full mx-auto" />
              </div>
              <p className="mt-4">Name: {name}</p>
              {quote && <p className="mt-2">Quote: {quote}</p>}
            </motion.div>
          )}
          {step === 5 && (
            <SuccessAnimation
              onComplete={() => {
                setTimeout(() => {
                  navigate('/yearbook'); // Replace with your target route
                }, 1500);
              }}
            />
          )}
        </AnimatePresence>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="fixed top-0 left-0 right-0 bottom-0 bg-purple-800 z-40"
        />
      </div>
    </div>
  );
};

export default OnboardingPopups;