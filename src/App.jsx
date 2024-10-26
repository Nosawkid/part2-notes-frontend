import { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";
import noteServices from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("A new note");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteServices.createItem(noteObject).then((res) => {
      setNotes(notes.concat(res));
    });

    setNewNote("");
  };

  const handleNoteChange = (e) => {
    console.log(e.target.value);
    setNewNote(e.target.value);
  };

  const toggleImportance = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = {
      ...note,
      important: !note.important,
    };

    noteServices
      .updateItem(id, changedNote)
      .then((res) => {
        setNotes(notes.map((note) => (note.id === id ? res : note)));
      })
      .catch((error) => {
        setErrorMessage(`The not ${note.content} was removed from the server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id``));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((el) => el.important);

  useEffect(() => {
    noteServices
      .getAll()
      .then((res) => {
        setNotes(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!notes) {
    return null;
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input onChange={handleNoteChange} type="text" value={newNote} />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
