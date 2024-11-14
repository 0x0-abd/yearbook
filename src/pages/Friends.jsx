import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder, useIsPresent } from 'framer-motion';
import { UserCircle, Menu, XIcon, ChevronDown, ArrowUpAZ, ArrowDownAZ, ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { UserContext } from '../config/userContext';
import { publicRequest } from '../config/publicRequest';

const Friends = () => {
  const isPresent = useIsPresent();
  // const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [ friendQuotes, setFriendQuotes ] = useState([])
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState([
    { id: 1, name: "Alice Johnson", year: "Y-20", quote: "Dream big, achieve bigger!" },
    { id: 2, name: "Bob Smith", year: "Y-21", quote: "Innovation is the key to success." },
    { id: 3, name: "Charlie Brown", year: "Y-22", quote: "Learn from yesterday, live for today, hope for tomorrow." },
    { id: 4, name: "Diana Prince", year: "Y-20", quote: "The future belongs to those who believe in the beauty of their dreams." },
    { id: 5, name: "Ethan Hunt", year: "Y-21", quote: "Your time is limited, don't waste it living someone else's life." },
    { id: 6, name: "Fiona Gallagher", year: "Y-22", quote: "The only way to do great work is to love what you do." },
  ]);

  const filteredFriends = selectedYear === 'All'
    ? friendQuotes.filter(friend => friend.user.name.toLowerCase().includes(searchText.toLowerCase()))
    : friendQuotes.filter(friend => friend.user.rollNumber === selectedYear && friend.user.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const onSortEnd2 = (oldIndex, newIndex) => {
    setFriendQuotes((array) => arrayMoveImmutable(array, oldIndex, newIndex))
  }

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const getFriendQuotes = async(req, res) => {
      try {
        const response = await publicRequest.post('/api/friend/quote', { email:user.email });
        // console.log(response.data)
        if(response.data.status === 'success') setFriendQuotes(response.data.data)
        else console.error(response.data)
      } catch(err) {
        console.log("Error in fetching: " + err)
      }
    }
    if(user) getFriendQuotes();
  }, [user])

  const sortFriends = (type) => {
    let sortedFriends = [...friendQuotes];
    switch(type) {
      case 'nameAsc':
        sortedFriends.sort((a, b) => a.user.name.localeCompare(b.user.name));
        break;
      case 'nameDesc':
        sortedFriends.sort((a, b) => b.user.name.localeCompare(a.user.name));
        break;
      case 'yearAsc':
        sortedFriends.sort((a, b) => a.user.rollNumber.localeCompare(b.user.rollNumber));
        break;
      case 'yearDesc':
        sortedFriends.sort((a, b) => b.user.rollNumber.localeCompare(a.user.rollNumber));
        break;
      default:
        break;
    }
    setFriendQuotes(sortedFriends);
  }

  const checkOrder = async () => {
    console.log(friendQuotes)
    const friendIds = friendQuotes.map(friendQuote => friendQuote.user._id);

    try {
      const response = await publicRequest.post('/api/friend/order', {
        email: user.email,
        newOrder: friendIds
      })

      console.log(response.data)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white md:px-10 lg:px-20">
      {/* Animated background */}
      <svg className="fixed inset-0 -z-50 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* ... (background SVG code remains the same) ... */}
      </svg>

      {/* Navbar */}

      {/* Main content */}
      <main className="container mx-auto p-2 md:p-4">
        <div className="md:flex justify-between text-center items-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Friends</h1>
          <div className="flex items-center justify-center space-x-2">
            {/* <button onClick={checkOrder} className='p-2 bg-purple-600 text-white rounded-md text-md md:text-lg'>
              Save
            </button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="p-2 bg-sky-800 text-white border-2 border-sky-600 hover:bg-sky-700 hover:border-sky-500">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=' bg-sky-800 text-white'>
                <DropdownMenuItem onClick={() => sortFriends('nameAsc')}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  <span>Sort by Name (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortFriends('nameDesc')}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>Sort by Name (Z-A)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortFriends('yearAsc')}>
                  <ArrowUpNarrowWide className="mr-2 h-4 w-4" />
                  <span>Sort by Year (Ascending)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortFriends('yearDesc')}>
                  <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
                  <span>Sort by Year (Descending)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative w-64">
              <Input
                className='max-w-sm text-md md:text-lg border-sky-600  bg-sky-800 text-white placeholder:text-gray-100 hover:bg-sky-700 hover:border-sky-500'
                placeholder="Search friends..."
                value={searchText}
                onChange={handleSearchTextChange}
              />
              {searchText && <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                onClick={() => {
                  setSearchText('')
                }}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
              }
            </div>
          </div>
        </div>

        <AnimatePresence>
          {/* {filteredFriends.map((friend) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-xl border border-blue-300 border-opacity-30 cursor-move"
              >
                <img
                  src={`/api/placeholder/150/150`}
                  alt={friend.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md"
                />
                <h2 className="text-xl font-semibold mb-2">{friend.name}</h2>
                <p className="text-sm text-blue-200 mb-2">{friend.year}</p>
                <p className="text-sm italic">"{friend.quote}"</p>
              </motion.div>
            ))} */}
          {/* <SortableList onSortEnd={onSortEnd} className="flex flex-wrap select-none" draggedItemClassName={"opacity:0"}> */}
          <SortableList onSortEnd={onSortEnd2} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-2" draggedItemClassName={"opacity:0"}>
            {friends && filteredFriends.map((friend) => (
              <SortableItem key={friend._id}>
                <div 
                  // layout
                  // initial={{ opacity: 0, scale: 0.8 }}
                  // animate={{ opacity: 1, scale: 1 }}
                  // exit={{ opacity: 0, scale: 0.8 }}
                  // transition={{ duration: 0.3 }}
                  className="bg-gray-800 text-center bg-opacity-50 p-4 m-2 rounded-xl shadow-xl border border-blue-300 border-opacity-30">
                  <div
                    className="cursor-move"
                  >
                    <img
                      src={friend.user.photoURL}
                      alt={friend.name}
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md"
                      draggable="false"
                    />
                    <h2 className="text-xl text-white font-semibold mb-2">{friend.user.name}</h2>
                    <p className="text-sm text-blue-200 mb-2">Y-{`${friend.user.rollNumber}`.slice(0, 2)}</p>
                    <p className="text-sm italic text-white">"{friend.quote}"</p>
                  </div>
                </div>
              </SortableItem>
            ))}
            {/* {friendQuotes.map((friend) => (
              <SortableItem key={friend._id}>
                <div 
                  // layout
                  // initial={{ opacity: 0, scale: 0.8 }}
                  // animate={{ opacity: 1, scale: 1 }}
                  // exit={{ opacity: 0, scale: 0.8 }}
                  // transition={{ duration: 0.3 }}
                  className="relative flex shrink-0 m-2 cursor-grab rounded-full shadow-lg select-none">
                  <div
                    className="bg-gray-800 w-full text-center bg-opacity-50 p-4 rounded-xl shadow-xl border border-blue-300 border-opacity-30 cursor-move"
                  >
                    <img
                      src={friend.user.photoURL}
                      alt={friend.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md select-none"
                      draggable="false"
                    />
                    <h2 className="text-xl font-semibold mb-2">{friend.user.name}</h2>
                    <p className="text-sm text-blue-200 mb-2">Y-{`${friend.user.rollNumber}`.slice(0, 2)}</p>
                    <p className="text-sm italic">"{friend.quote}"</p>
                  </div>
                </div>
              </SortableItem>
            ))} */}
          </SortableList>
        </AnimatePresence>
      </main>
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

export default Friends;