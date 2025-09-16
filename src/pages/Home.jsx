import React, {useEffect, useState} from 'react';
import { loadShelves, saveShelves } from '../utils';
import Shelf from '../components/Shelf';
import BulkBar from '../components/BulkBar';


 //Home shows shelves and supports multi-select bulk move

export default function Home(){
  const [shelves, setShelves] = useState(loadShelves); // initializes shelves state with data from loadShelves()
  const [selectedIds, setSelectedIds] = useState([]); //keeps track of books selected via chkbox

  useEffect(()=>{ 
      saveShelves(shelves); //if shelves changes, it saves the new state using saveShelves
    }, [shelves]);

  const onChangeShelf = (book, shelf) => {
    // create fresh empty shelves
    const cleaned = { currentlyReading: [], wantToRead: [], read: [] };

    //Remove the book from every shelf
    Object.keys(shelves).forEach(k => {
      cleaned[k] = shelves[k].filter(b => b.id !== book.id); //removes the book to move by ID
    });

    if(shelf !== 'none'){
      cleaned[shelf] = [{...book, shelf}, ...cleaned[shelf]]; //adds book to selected shelf unless none is selected
    }
    setShelves(cleaned);
    setSelectedIds(prev => prev.filter(id => id !== book.id)); // removed moved book id so that it doesnt stay selected after moving
  };

  const onToggleSelect = (bookId, checked) => {
    setSelectedIds(prev => { //if chkd=> bookid moved to selectedid
      if(checked) return [...new Set([...prev, bookId])]; // set used to remove duplicates, add new books to prev list
      return prev.filter(id => id !== bookId); //if deselected=> remove by filtering it out
    });
  };

  const bulkMove = (targetShelf) => {
    if(!targetShelf) return; //if no target shelf then do nothing
    const cleaned = { currentlyReading: [], wantToRead: [], read: [] };
    // keep unselected books, then add selected to target
    Object.keys(shelves).forEach(k => {
      cleaned[k] = shelves[k].filter(b => !selectedIds.includes(b.id)); //Removes selected books from all shelves.only unselected
    });
    const toMove = []; //selected ones are added here
    Object.keys(shelves).forEach(k => {
      shelves[k].forEach(b => {
        if(selectedIds.includes(b.id)) toMove.push({...b, shelf: targetShelf}); //copy each selected book and update its shelf property to the new shelf


      });
    });
    if(targetShelf !== 'none'){
      cleaned[targetShelf] = [...toMove, ...cleaned[targetShelf]]; //Copy the book and update its shelf property to the new shelf
    }
    setShelves(cleaned);
    setSelectedIds([]); //Update shelves and reset selection
  };

  return (
    <main className="container"> 
      <BulkBar selectedCount={selectedIds.length} onMove={bulkMove} /> 
      <section className="shelves"> 
        <h2>Currently Reading</h2>
        <Shelf 
        title="currentlyReading" 
        books={shelves.currentlyReading} 
        onChangeShelf={onChangeShelf} 
        onToggleSelect={onToggleSelect} 
        selectedIds={selectedIds} 
        />
        <h2>Want to Read</h2>
        <Shelf 
        title="wantToRead" 
        books={shelves.wantToRead} 
        onChangeShelf={onChangeShelf} 
        onToggleSelect={onToggleSelect} 
        selectedIds={selectedIds} 
        />
        <h2>Read</h2>
        <Shelf 
        title="read" 
        books={shelves.read} 
        onChangeShelf={onChangeShelf} 
        onToggleSelect={onToggleSelect} 
        selectedIds={selectedIds} 
        />
      </section>
    </main>
  );
}
