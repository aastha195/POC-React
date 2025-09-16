import React from 'react';

//apply bulk actions to a set of selected books
//how many books selected => moves them to new shelf on selecting
// if none selected then buttons are disabled 

const OPTIONS = [
  {key:'currentlyReading', label:'Move to Currently Reading'}, //together actions for selected books
  {key:'wantToRead', label:'Move to Want to Read'},
  {key:'read', label:'Move to Read'}, //key => shelf to move books to
  {key:'none', label:'Remove (None)'}, 
];

export default function BulkBar({selectedCount, onMove}){ // no of books selected, function when action takes place
  return (
    <div className="bulkbar">
      <div>{selectedCount} selected</div> 
      <div className="bulk-actions">
        {OPTIONS.map(o =>(  //map creates button for each action
           <button 
           key={o.key}
           onClick={()=>onMove(o.key)} //on clicking on move is called wrt shelf
           disabled={selectedCount===0} //no action if nothing is selected
           >
            {o.label}
            </button>
          ))} 
      </div>
    </div> // on clicking it tells parent components to shift selected books
    // if no books are selected then disabled works 
  );
}
