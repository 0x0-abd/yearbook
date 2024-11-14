import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';
import { XIcon, Plus, Edit, ChevronDown, ArrowUpAZ, ArrowDownAZ, ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
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
import axios from 'axios';

function Yearbook() {
  const isPresent = useIsPresent();
  const { user, setUser } = useContext(UserContext);
  const [quotes, setQuotes] = useState([]);
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
    ? quotes.filter(friend => friend.user.name.toLowerCase().includes(searchText.toLowerCase()))
    : quotes.filter(friend => friend.user.rollNumber === selectedYear && friend.user.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };
  const onSortEnd = (oldIndex, newIndex) => {
    setFriends((array) => arrayMoveImmutable(array, oldIndex, newIndex))
  }

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const sortFriends = (type) => {
    let sortedFriends = [...quotes];
    switch (type) {
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
    setQuotes(sortedFriends);
  }

  useEffect(() => {
    const getQuotes = async () => {
      try {
        const res = await axios.get('https://odyssey-iota-vert.vercel.app/api/quote');
        // console.log(res.data.data);
        if (res.data.status === 'success') setQuotes(res.data.data);
        else console.log(res.data);
      } catch (err) {
        console.error("Error occured: " + err)
      }
    }

    if (user) getQuotes();
  }, [user]);

  const displayQuote = (quote) => {
    // console.log(quote.length)
    if (quote.length > 80) return quote.slice(0, 80) + "...";
    else return quote;
  }

  return (
    <>
      <Outlet />

      <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 via-blue-900 to-purple-900 text-white px-2 md:px-10 lg:px-20">
        {/* Animated background */}
        <svg className="fixed inset-0 -z-50 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* ... (background SVG code remains the same) ... */}
        </svg>

        {/* Navbar */}

        {/* Main content */}
        <main className="container mx-auto p-2 md:p-4">
          <div className="md:flex lg:flex justify-between text-center items-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Yearbook</h1>
            <div className="flex items-center space-x-2 justify-center">
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
                  placeholder="Search..."
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
              {quotes && filteredFriends.map((quote) => (
                <motion.div
                  key={quote._id}
                  layout
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 text-center bg-opacity-50 m-2  rounded-xl shadow-xl border border-blue-300 border-opacity-30"
                >
                  <Link to={`/yearbook/${quote.user.rollNumber}`} key={quote._id} className="block p-4 rounded-xl">
                    <img
                      src={quote.user.photoURL}
                      alt={quote.user.name}
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md"
                    />
                    <h2 className="text-xl font-semibold mb-2">{quote.user.name}</h2>
                    <p className="text-sm text-blue-200 mb-2">Y-{`${quote.user.rollNumber}`.slice(0, 2)}</p>
                    <p className="text-sm italic">"{displayQuote(quote.quote)}"</p>
                  </Link>
                </motion.div>
              ))}
              {/* {quotes && quotes.map((quote) => (
                // <Link to={`/yearbook/${quote.user.rollNumber}`} key={quote._id} className=''> 
                <motion.div
                  key={quote._id}
                  layout
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 text-center bg-opacity-50 m-2  rounded-xl shadow-xl border border-blue-300 border-opacity-30"
                >
                  <Link to={`/yearbook/${quote.user.rollNumber}`} key={quote._id} className="block p-4 rounded-xl">
                    <img
                      src={quote.user.photoURL}
                      alt={quote.user.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-300 shadow-md"
                    />
                    <h2 className="text-xl font-semibold mb-2">{quote.user.name}</h2>
                    <p className="text-sm text-blue-200 mb-2">Y-{`${quote.user.rollNumber}`.slice(0, 2)}</p>
                    <p className="text-sm italic">"{displayQuote(quote.quote)}"</p>
                  </Link>
                </motion.div>

              ))} */}
            </div>
          </AnimatePresence>
        </main>
        {user &&
          <motion.div
            className="fixed bottom-6 right-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { duration: 0.2, ease: "easeOut" } }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/quote">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-xl ${user.quote
                  ? ' bg-yellow-500 hover:bg-amber-500'
                  : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors`}
              >
                {user.quote ? (
                  <>
                    <Edit size={20} />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create</span>
                  </>
                )}
              </button>
            </Link>
          </motion.div>
        }
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="fixed top-0 left-0 right-0 bottom-0 bg-purple-800 z-40"
        />
      </div>
    </>
  );
};

export default Yearbook
