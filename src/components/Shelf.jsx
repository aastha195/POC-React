import React from 'react';
import BookCard from './BookCard';

export default function Shelf({title, books, onChangeShelf, onToggleSelect, selectedIds}){

  //if shelf are empty => message saying no books
  

  return ( //shelf->css grid->rows and columns
    <div className="shelf">
      <div className="grid"> 
        {books.length === 0 && <p className="muted">No books</p>} 
        {books.map(b => 
        <BookCard key={b.id} //maps key to book id
         book={b} 
         currentShelf={b.shelf||title} //if not having shelf=> title of shelf 
         onChangeShelf={onChangeShelf} 
         onToggleSelect={onToggleSelect} // passes down props like changing shelf or selecting chk or selected id
         selectedIds={selectedIds} 
         />
         )}
      </div> 
    </div>
  );
}
