export const SHELF_KEYS = ['currentlyReading','wantToRead','read','none'];

export function loadShelves(){
  const raw = localStorage.getItem('bookshelves_v2'); //Reads saved shelf data from the browser localStorage
  if(!raw) return { currentlyReading: [], wantToRead: [], read: [] };
  try{ const s = JSON.parse(raw);return s;}  //raw-> unprocessed, unparsed data in string
     catch(e){ return { currentlyReading: [], wantToRead: [], read: [] }; }
  // if data found, then parse json into js =>return saved shelf obj
}

export function saveShelves(shelves){
  localStorage.setItem('bookshelves_v2', JSON.stringify(shelves));
  //converts obj to json=> saves it in browser local storage
}

//allows the app to remember the shelves and books even if you refresh or close the browser