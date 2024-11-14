// import { useNavigate } from 'react-router-dom';


// const QuoteDetails = () => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-indigo-500 bg-opacity-10 z-10"
//       onClick={() => navigate(-1)}  // Close modal on background click
//     >
//       <div className="modal-content bg-white p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
//         {/* Modal content here */}
//         <h2>Quote Details</h2>
//         <p>Details about the selected quote...</p>
//       </div>
//     </div>
//   );
// };

// export default QuoteDetails;

import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { publicRequest } from '../config/publicRequest';
import { UserContext } from '../config/userContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'

const AnimatedModal = ({ onClose, children }) => {
    return (
        <AnimatePresence>
            {(
                <motion.div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur bg-indigo-300 bg-opacity-30 z-10 lg:pt-20 lg:pb-10"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className=" bg-black bg-opacity-60 m-2 rounded-3xl shadow-2xl border-2 border-blue-200 border-opacity-30 overflow-y-auto max-h-full"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                                duration: 0.3
                            }
                        }}
                        exit={{
                            scale: 0.5,
                            opacity: 0,
                            transition: {
                                duration: 0.2
                            }
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Example usage
const QuoteDetails = () => {
    //   const [isOpen, setIsOpen] = React.useState(true);
    const navigate = useNavigate();
    const [quote, setQuote] = useState();
    const [isFriend, setIsFriend] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const lastSegment = useLocation().pathname.split('/').pop() || '';

    useEffect(() => {
        const getData = async () => {
            // console.log(lastSegment)
            try {
                const res = await publicRequest.get(`/api/quote/${lastSegment}`);
                setQuote(res.data.data)
                // console.log(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        getData();
    }, [])

    useEffect(() => {
        // if(user && quote) {
        //     console.log(user.friends)
        //     console.log(quote.user)
        // }
        if(user && quote) setIsFriend(user.friends.some(item => item.friend == quote.user._id));
        // if(user) console.log(user)
    }, [quote, user])

    const addFriend = async () => {
        try {
          const response = await publicRequest.post('/api/friend/add', {
            email: user.email,
            friendId: quote.user._id
          });
          setUser(prevUser => ({
            ...prevUser,
            friends: response.data.friends
          }));
          setIsFriend(true); // Update the state to reflect friendship
        } catch (error) {
          console.error('Error adding friend:', error);
        }
    };

    const removeFriend = async () => {
        try {
          const response = await publicRequest.post('/api/friend/remove', {
            email: user.email,
            friendId: quote.user._id
          });
          setUser(prevUser => ({
            ...prevUser,
            friends: response.data.friends
          }));
          setIsFriend(false); // Update the state to reflect friendship
        } catch (error) {
          console.error('Error adding friend:', error);
        }
    };

    return (
        <>
            <AnimatedModal onClose={() => navigate(-1)} >
                {quote &&
                    <div className='flex flex-col h-5/6 md:h-[550px] md:flex-row overflow-y-auto'>
                        <div className="space-y-4 h-full flex flex-col items-center rounded-l-3xl bg-black bg-opacity-40 justify-center border-blue-200 border-r-2 border-opacity-30">

                            <img
                                src={quote.user.photoURL}
                                alt={quote.user.name}
                                className="w-72 h-72 lg:w-96 lg:h-96 mx-auto  shadow-md"
                            />
                            <p className="text-sm italic text-white">"{quote.quote}"</p>
                            <div className='flex w-full justify-around pb-2'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    Close
                                </button>
                                {user && (!isFriend ? (
                                    <button
                                        onClick={addFriend}
                                        className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-100'
                                    >
                                        Add Friend
                                    </button>
                                ) : (
                                    <button
                                        onClick={removeFriend}
                                        className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-100'
                                    >
                                        Remove Friend
                                    </button>
                                ))}
                            </div>
                        </div>
                        <CommentsSection quote={quote} user={user} setQuote={setQuote} />
                    </div>
                }
            </AnimatedModal>
        </>
    );
};

const CommentsSection = ({ quote, user, setQuote }) => {
    const [newComment, setNewComment] = useState('');

    const handleDeleteComment = async (commentId) => {
        // Code to delete the comment goes here
        // console.log(`Deleting comment with ID: ${commentId}`);
        try {
            const response = await publicRequest.delete(`/api/quote/${quote._id}`, {
                data: {
                    email: user.email,
                    commentId
                }
            });
            // console.log('Comment deleted:', response.data);
            setQuote((prev) => ({
                ...prev,
                comments: prev.comments.filter(comment => comment._id !== commentId)
            }));
        } catch (error) {
            console.error('Error deleting comment:', error.response ? error.response.data : error.message);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            // Code to add a new comment goes here
            // console.log(`Adding new comment: ${newComment}`);
            try {
                const res = await publicRequest.post(`/api/quote/${quote._id}`, {
                    email: user.email,
                    comment: newComment.trim()
                });
                // console.log(res.data);
                setQuote(res.data.data)
            } catch (err) {
                console.error(err)
            }

            setNewComment('');
        }
    };

    return (
        <div className="p-4 h-full max-w-md md:min-w-72 lg:min-w-80">
            <h2 className="text-xl font-semibold mb-2 pb-1 w-full text-white border-blue-200 border-opacity-30 border-b-2">
                {quote.user.name}
                <span className="text-xl mb-2 float-right text-white">
                    Y-{`${quote.user.rollNumber}`.slice(0, 2)}
                </span>
            </h2>
            <ScrollArea className="space-y-2 h-4/5 flex flex-col items-center justify-center">
                {quote.comments.map((comment) => (
                    <div key={comment._id} className="flex items-start justify-between my-2">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={comment.user.photoURL} />
                                <AvatarFallback>{comment.user.name}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-sky-50">{comment.user.name}</h3>
                                <p className="text-sm text-blue-200">{comment.comment}</p>
                            </div>
                        </div>
                        {user && (quote.user._id === user.id || comment.user._id === user.id) && (<Button
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-400 hover:text-gray-600 mr-2"
                        >
                            <span className="sr-only">Delete comment</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Button>)}
                    </div>
                ))}
            </ScrollArea>
            {/* <div className="space-y-2">

            </div> */}
            {user ? (<div className="mt-2 flex items-center float-end border-blue-200 border-opacity-30 border-t-2 py-3 px-2">
                <Avatar className='mr-3'>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>Your Avatar</AvatarFallback>
                </Avatar>
                <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddComment();
                        }
                    }}
                    className="flex-1"
                />
                <Button onClick={handleAddComment} className="ml-3">
                    Post
                </Button>
            </div>) : (
                <div className='mt-2 flex items-center float-end border-blue-200 border-opacity-30 border-t-2 py-3 px-2 w-full'>
                </div>
            )}
        </div>
    );
};

export default QuoteDetails;