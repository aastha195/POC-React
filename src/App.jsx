import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; //switching pages (routing)
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';

export default function App(){
  return ( //matches routes without full page reloads
    <BrowserRouter> 
      <div className="app"> 
        <nav className="nav">
          <h1 className="logo">Bookshelf</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/search" className="ml">Search</Link> 
          </div>
        </nav>
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

//Toggles bw home and search page







// How Debounce Works?
// You start typing in a search box.
// Normally, every letter you type would instantly send a search request.
// But with debounce, the app waits until you pause typing for (say) 400 milliseconds.
// Only then it sends the search request.
// If you keep typing before 400ms passes, the timer resets.
// So, it avoids sending too many requests and saves resources.