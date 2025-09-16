import React, { useState, useRef, useEffect } from 'react'; 

//Shelf content
const SHELVES = [
  { key: 'currentlyReading', label: 'Currently Reading' },
  { key: 'wantToRead', label: 'Want to Read' }, //key-> logic, label -> displayed in UI
  { key: 'read', label: 'Read' },
  { key: 'none', label: 'None' },
];
//Components and props
export default function BookCard({
  book,
  currentShelf = 'none',
  onChangeShelf,                  
  showCheckbox = true,
  onToggleSelect, // callback fn when chkbox is selected
  selectedIds = [],
}) {
  //Dropdown state
  const [open, setOpen] = useState(false); //tracks if dropdwn is open(true)/close(false)
  const dropdownRef = useRef(null);            //detect click out of dropdn so we can close automatically

  // Close dropdown when clicking outside
  useEffect(() => { //runs once only because of empty array
    function handleClickOutside(event) {  //checks if click is outside dropdn
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { //click is inside drpdn->event.target 
        setOpen(false); //closes after selecting
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside); //removes event listener
  }, []);

  return (
    <div className="bookcard">
      {showCheckbox && ( // renders only if chk box is true
        <input
          className="chk"
          type="checkbox"
          checked={selectedIds.includes(book.id)} // checks if selected id has book id or not
          onChange={(e) =>
            onToggleSelect && onToggleSelect(book.id, e.target.checked) //calls when user select book
          }
        />
      )}

      
      <div className="thumb"> 
        {book.thumbnail ? ( // thumbnail and img section
          <img src={book.thumbnail} alt={book.title} />
        ) : (
          <div className="noimg">No image</div> //if book img is not present
        )}
      </div>

      <div className="meta">
        <h4>{book.title}</h4>
        <p className="authors">{(book.authors || []).join(', ')}</p>
      </div>

      
      <div className="action" ref={dropdownRef}>
        <div className="dropdown">
          <button
            className="dropbtn"        //dropdownRef -> detect click outside and close menu automatically
            onClick={() => setOpen((prev) => !prev)} //on clicking , opens or closes dropdowm menu
          >
            🠋
          </button>
          <div className={`menu ${open ? 'open' : ''}`}>
            {SHELVES.map((s) => ( 
              <button  //creates button for each shelf
                key={s.key}
                onClick={() => {
                  onChangeShelf && onChangeShelf(book, s.key); //after clicking moves that book to corresp shelf
                  setOpen(false); //  closes after selecting
                }}
                className={s.key === currentShelf ? 'active' : ''} //see if this is current shelf or not
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
