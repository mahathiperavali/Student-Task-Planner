import { useState, useEffect } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Tasks from './pages/Tasks'
import Reminders from './pages/Reminders'
import Settings from './pages/Settings'

import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('plannerUser')

    if (savedUser) {
      return JSON.parse(savedUser)
    }

    return null
  })

  const [showRegister, setShowRegister] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  // =========================
  // TASKS - MongoDB
  // =========================

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) {
      setTasks([])
      return
    }

    const token = localStorage.getItem('token')

    async function loadTasks() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/tasks',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load tasks'
          )
        }

        setTasks(data)
      } catch (error) {
        console.error('Load tasks error:', error)
      }
    }

    loadTasks()
  }, [user])

  // =========================
  // EVENTS - MongoDB
  // =========================

  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!user) {
      setEvents([])
      return
    }

    const token = localStorage.getItem('token')

    async function loadEvents() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/events',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load events'
          )
        }

        setEvents(data)
      } catch (error) {
        console.error('Load events error:', error)
      }
    }

    loadEvents()
  }, [user])

  // =========================
  // REMINDERS - MongoDB
  // =========================

  const [reminders, setReminders] = useState([])

  useEffect(() => {
    if (!user) {
      setReminders([])
      return
    }

    const token = localStorage.getItem('token')

    async function loadReminders() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/reminders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load reminders'
          )
        }

        setReminders(data)
      } catch (error) {
        console.error(
          'Load reminders error:',
          error
        )
      }
    }

    loadReminders()
  }, [user])

  // =========================
  // SETTINGS - localStorage
  // =========================

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(
      'studentPlannerSettings'
    )

    if (savedSettings) {
      return JSON.parse(savedSettings)
    }

    return {
      name: 'Student',
      notifications: true,
      compactMode: false,
    }
  })

  useEffect(() => {
    localStorage.setItem(
      'studentPlannerSettings',
      JSON.stringify(settings)
    )
  }, [settings])

  useEffect(() => {
    if (user) {
      setSettings((previousSettings) => ({
        ...previousSettings,
        name: user.name,
      }))
    }
  }, [user])

  // =========================
  // LOGIN
  // =========================

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
    setCurrentPage('dashboard')
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('plannerUser')

    setTasks([])
    setEvents([])
    setReminders([])
    setUser(null)
    setCurrentPage('dashboard')
  }

  function handleRegister() {
    setShowRegister(false)
  }

  // =========================
  // TASK STATISTICS
  // =========================

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length

  const today = new Date()
    .toISOString()
    .split('T')[0]

  const dueToday = tasks.filter(
    (task) =>
      task.dueDate === today &&
      !task.completed
  ).length

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        )

  // =========================
  // PAGE SWITCHING
  // =========================

  function showPage() {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            events={events}
            reminders={reminders}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
            dueToday={dueToday}
            completionPercentage={completionPercentage}
            setCurrentPage={setCurrentPage}
          />
        )

      case 'calendar':
        return (
          <Calendar
            tasks={tasks}
            events={events}
            setEvents={setEvents}
          />
        )

      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            setTasks={setTasks}
          />
        )

      case 'reminders':
        return (
          <Reminders
            reminders={reminders}
            setReminders={setReminders}
          />
        )

      case 'settings':
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
          />
        )

      default:
        return <Dashboard />
    }
  }

  // =========================
  // LOGIN / REGISTER SCREEN
  // =========================

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onShowLogin={() => setShowRegister(false)}
        />
      )
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    )
  }

  // =========================
  // MAIN APP
  // =========================

  return (
    <div
      className={`app ${
        settings.compactMode
          ? 'compact-mode'
          : ''
      }`}
    >
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-content">
        <div className="top-bar">
          <span>
            Welcome, <strong>{user.name}</strong>
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {showPage()}
      </main>
    </div>
  )
}

export default App