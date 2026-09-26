import { useState } from 'react'

function Reminders({ reminders, setReminders }) {
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:5000/api/reminders'

  function getHeaders() {
    const token = localStorage.getItem('token')

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  function openForm() {
    setTitle('')
    setDate('')
    setTime('')
    setError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setTitle('')
    setDate('')
    setTime('')
    setError('')
  }

  async function addReminder(event) {
    event.preventDefault()

    if (title.trim() === '') {
      setError('Please enter a reminder.')
      return
    }

    if (date === '') {
      setError('Please select a date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          date,
          time,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create reminder'
        )
      }

      setReminders((previousReminders) => [
        ...previousReminders,
        data,
      ])

      closeForm()
    } catch (error) {
      console.error('Create reminder error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleReminder(id) {
    const reminder = reminders.find(
      (item) => item._id === id
    )

    if (!reminder) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({
            completed: !reminder.completed,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update reminder'
        )
      }

      setReminders((previousReminders) =>
        previousReminders.map((item) =>
          item._id === id ? data : item
        )
      )
    } catch (error) {
      console.error(
        'Update reminder error:',
        error
      )

      setError(error.message)
    }
  }

  async function deleteReminder(id) {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete reminder'
        )
      }

      setReminders((previousReminders) =>
        previousReminders.filter(
          (item) => item._id !== id
        )
      )
    } catch (error) {
      console.error(
        'Delete reminder error:',
        error
      )

      setError(error.message)
    }
  }

  const upcomingReminders = reminders.filter(
    (reminder) => !reminder.completed
  )

  const completedReminders = reminders.filter(
    (reminder) => reminder.completed
  )

  return (
    <div className="reminders-page">

      <div className="page-header">
        <div>
          <h1>Reminders 🔔</h1>

          <p>
            Keep track of important things you don't
            want to forget.
          </p>
        </div>

        <button
          className="reminder-add-button"
          onClick={openForm}
        >
          + Add Reminder
        </button>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <div className="reminder-summary">

        <div className="reminder-summary-card">
          <span>🔔</span>

          <div>
            <strong>
              {upcomingReminders.length}
            </strong>

            <p>Upcoming</p>
          </div>
        </div>

        <div className="reminder-summary-card">
          <span>✅</span>

          <div>
            <strong>
              {completedReminders.length}
            </strong>

            <p>Completed</p>
          </div>
        </div>

      </div>

      {showForm && (
        <form
          className="reminder-form"
          onSubmit={addReminder}
        >
          <div className="form-header">

            <div>
              <h2>Add New Reminder</h2>

              <p>
                Set a reminder for something important.
              </p>
            </div>

            <button
              type="button"
              className="form-close"
              onClick={closeForm}
            >
              ✕
            </button>

          </div>

          <div className="reminder-form-grid">

            <label>
              Reminder

              <input
                type="text"
                placeholder="Example: Submit assignment"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </label>

            <label>
              Date

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />
            </label>

            <label>
              Time

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />
            </label>

          </div>

          <div className="task-form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={closeForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-task-button"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : 'Save Reminder'}
            </button>

          </div>

        </form>
      )}

      <section className="reminder-section">

        <div className="reminder-section-header">

          <div>
            <h2>Upcoming Reminders</h2>

            <p>
              Things you still need to remember.
            </p>
          </div>

        </div>

        <div className="reminders-card">

          {upcomingReminders.length > 0 ? (
            upcomingReminders.map((reminder) => (

              <div
                className="reminder-item"
                key={reminder._id}
              >

                <button
                  type="button"
                  className="reminder-checkbox"
                  onClick={() =>
                    toggleReminder(reminder._id)
                  }
                />

                <div className="reminder-icon">
                  🔔
                </div>

                <div className="reminder-info">

                  <h3>{reminder.title}</h3>

                  <div className="reminder-details">

                    <span>
                      📅 {reminder.date}
                    </span>

                    <span>
                      🕐{' '}
                      {reminder.time || 'Any time'}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="reminder-delete"
                  onClick={() =>
                    deleteReminder(reminder._id)
                  }
                >
                  🗑️
                </button>

              </div>

            ))
          ) : (

            <div className="reminder-empty">

              <div>🎉</div>

              <h3>No upcoming reminders</h3>

              <p>
                You're all caught up!
              </p>

            </div>

          )}

        </div>

      </section>

      {completedReminders.length > 0 && (
        <section className="reminder-section">

          <div className="reminder-section-header">

            <div>
              <h2>Completed</h2>

              <p>
                Reminders you've already handled.
              </p>
            </div>

          </div>

          <div className="reminders-card completed-reminders">

            {completedReminders.map((reminder) => (

              <div
                className="reminder-item reminder-done"
                key={reminder._id}
              >

                <button
                  type="button"
                  className="reminder-checkbox checked"
                  onClick={() =>
                    toggleReminder(reminder._id)
                  }
                >
                  ✓
                </button>

                <div className="reminder-icon">
                  ✅
                </div>

                <div className="reminder-info">

                  <h3>{reminder.title}</h3>

                  <div className="reminder-details">

                    <span>
                      📅 {reminder.date}
                    </span>

                    <span>
                      🕐{' '}
                      {reminder.time || 'Any time'}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="reminder-delete"
                  onClick={() =>
                    deleteReminder(reminder._id)
                  }
                >
                  🗑️
                </button>

              </div>

            ))}

          </div>

        </section>
      )}

    </div>
  )
}

export default Reminders