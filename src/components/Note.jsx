const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "Marks as not important" : "Mark as important";
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
