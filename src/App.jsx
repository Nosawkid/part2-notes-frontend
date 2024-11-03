import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteServices from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import loginServices from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  // Login funcs
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Login  with', username, password)
    try {
      const userData = await loginServices.login({ username, password })
      window.localStorage.setItem('appUser', JSON.stringify(userData))
      setUser(userData)
      noteServices.setToken(userData.token)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('appUser')
    setUser(null)
  }

  const onUsernameChange = (e) => {
    setUsername(e.target.value)
  }
  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  // *********************

  const addNote = (noteObj) => {
    noteFormRef.current.toggleVisibility()
    noteServices.create(noteObj).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const toggleImportance = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find((n) => n.id === id)
    const changedNote = {
      ...note,
      important: !note.important,
    }

    noteServices
      .updateItem(id, changedNote)
      .then((res) => {
        setNotes(notes.map((note) => (note.id === id ? res : note)))
      })
      .catch((error) => {
        setErrorMessage(`The not ${note.content} was removed from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id``))
      })
  }

  const notesToShow = showAll ? notes : notes.filter((el) => el.important)

  useEffect(() => {
    if (!user) {
      const loggedUserJSON = window.localStorage.getItem('appUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        noteServices.setToken(user.token)
      }
    }
  }, [user])

  useEffect(() => {
    noteServices
      .getAll()
      .then((res) => {
        setNotes(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (!notes) {
    return null
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        <Togglable buttonLabel={'Reveal'}>
          {' '}
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={onUsernameChange}
            handlePasswordChange={onPasswordChange}
            username={username}
            password={password}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      {user !== null && (
        <Togglable buttonLabel={'New Note'} ref={noteFormRef}>
          <NoteForm createNote={addNote} />
        </Togglable>
      )}
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default App
