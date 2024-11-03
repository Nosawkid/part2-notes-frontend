// const NoteForm = ({ onSubmit, value, handleChange }) => {
//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <input onChange={handleChange} type="text" value={value} />
//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// };

import { useState } from "react";

// export default NoteForm;

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");
  const addNote = (e) => {
    e.preventDefault();
    createNote({
      content: newNote,
      important: true,
    });
    setNewNote("");
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
