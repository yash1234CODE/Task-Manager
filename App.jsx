import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8080/api/tasks'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    axios.get(API).then(res => setTasks(res.data)).catch(console.error)
  }, [])

  const addTask = () => {
    if (!title.trim()) return
    axios.post(API, { title, completed: false })
      .then(res => {
        setTasks(prev => [...prev, res.data])
        setTitle('')
      })
  }

  const toggle = (t) => {
    axios.put(`${API}/${t.id}`, { ...t, completed: !t.completed })
      .then(res => setTasks(prev => prev.map(x => x.id === res.data.id ? res.data : x)))
  }

  const remove = (id) => {
    axios.delete(`${API}/${id}`).then(() => setTasks(prev => prev.filter(x => x.id !== id)))
  }

  return (
    <div className="container">
      <h1>📝 Task Manager</h1>
      <div className="new">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task..." />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(t => (
          <li key={t.id} className={t.completed ? 'done' : ''}>
            <input type="checkbox" checked={t.completed} onChange={()=>toggle(t)} />
            <span>{t.title}</span>
            <button className="del" onClick={()=>remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
