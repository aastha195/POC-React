import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom'; //for navigation
import BookCard from '../components/BookCard';
import { loadShelves, saveShelves } from '../utils'; //get and save shelf data

function debounce(fn, ms){ //function , milisecond
   let t; //variable t to store the timeout id
   return (...args)=>{ 
     clearTimeout(t); // clears prev timeout running
   t = setTimeout(()=>fn(...args), ms); //sets new timeout
   }; 
  }

export default function SearchPage(){
  const navigate = useNavigate(); //go back front
  const [query, setQuery] = useState(''); //Search input text
  const [results, setResults] = useState([]); //Books fetched from API
  const [suggestions, setSuggestions] = useState([]); //List of auto-suggestions

  const shelves = loadShelves(); //reads the saved shelves
  const [localShelves, setLocalShelves] = useState(shelves); //will store books categorized into shelves

  useEffect(()=>{ 
    fetch('/suggestions.json') //fetches suggestions from a local file
    .then(r=>r.json()) // Updates suggestions state
    .then(setSuggestions)
    .catch(()=>{});
   }, []); //runs once, because of the empty dependency array

  useEffect(()=>{
     saveShelves(localShelves); //on changes, save the new state using saveShelves()
     }, [localShelves]);

  const runSearch = async (q) => { //calls the Google Books API with the query q on search box
    if(!q) { setResults([]); return; } //avoid unnecessary API calls when the input is blank, no API call gets made
    try{
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`); //limits result to 20 books
      //encode URI comp-> prevent spaces from breaking query
      const data = await res.json(); //parses response into json
      setResults(data.items || []); //either api result or nothing
    } catch(e){ //catch karlo error
      setResults([]);
    }
  };

  const debounced = useRef(debounce(runSearch, 400)).current; //waits 400 milliseconds after last call, Prevents making an API request on every single keystroke.
  //use ref is used so that value stays same after re-rendering

  const onChange = (e) => {
    const v = e.target.value; //what user typed
    setQuery(v); //updates query state
    debounced(v); // gives new value after search (waits 400ms)
  };


  //check which shelf book is in
  const getShelfForBook = (bookId) => {
    for(const k of Object.keys(localShelves)){
      if(localShelves[k].some(b => b.id === bookId)) return k;
    }
    return 'none';
  };

  const onChangeShelf = (book, shelf) => {
    // update localShelves
    const cleaned = { currentlyReading: [], wantToRead: [], read: [] }; //Creates a fresh empty structure for all shelves
    Object.keys(localShelves).forEach(k => cleaned[k] = localShelves[k].filter(b => b.id !== book.id)); //loops through and removes the book from that shelf
    if(shelf !== 'none'){ cleaned[shelf] = [{...book, shelf}, ...cleaned[shelf]]; } //if not none=> book should be moved
    setLocalShelves(cleaned); //updates shelf
  };

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0,6); 
  // filters, makes case insensitive and limits no of suggestions to top 6

  return (
    // Back button to go to prev page
    <main className="container"> 
      <button className="back" onClick={()=>navigate(-1)}>← Back</button> 
      <div className="searchBox"> 
        <input placeholder="Search books (try: web development)" value={query} onChange={onChange} /> 
        <button onClick={()=>runSearch(query)}>Search</button>
      </div> 
      {query && filteredSuggestions.length > 0 && ( //Only shows if query is not empty and filtered suggestions(conditional ren)
        <ul className="suggestions">
          {filteredSuggestions.map(s => <li key={s} onClick={()=>{ setQuery(s); runSearch(s); }}>{s}</li>)}
        </ul>
      )}
      <section>
        <h2>Results {query ? `"${query}"` : ''}</h2> 
        <div className="grid">
          {results.length === 0 && <p>No results</p>}
          {results.map(item => {
            const b = {
              id: item.id,
              title: item.volumeInfo.title, //bookcard comp (book details)
              authors: item.volumeInfo.authors || [],
              thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
            };
            const shelf = getShelfForBook(b.id);
            return <BookCard key={b.id} book={b} currentShelf={shelf} onChangeShelf={onChangeShelf} showCheckbox={false} />
          })}
        </div>
      </section>
    </main>
  );
}
