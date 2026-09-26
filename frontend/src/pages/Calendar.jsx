import { useState } from 'react'

function Calendar({ tasks, events, setEvents }) {
  function getTodayString() {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0')
    const day = String(
      today.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function createDateFromString(dateString) {
    const [year, month, day] =
      dateString.split('-').map(Number)

    return new Date(year, month - 1, day)
  }

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0')
    const day = String(
      date.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function getWeekDates(dateString) {
    const selected = createDateFromString(
      dateString
    )

    const dayOfWeek = selected.getDay()

    const sunday = new Date(selected)

    sunday.setDate(
      selected.getDate() - dayOfWeek
    )

    const weekDates = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday)

      date.setDate(
        sunday.getDate() + i
      )

      weekDates.push({
        date: formatDate(date),
        day: date.getDate(),
        name: date.toLocaleDateString(
          'en-US',
          {
            weekday: 'short',
          }
        ),
      })
    }

    return weekDates
  }

  function formatSelectedDate(dateString) {
    const date =
      createDateFromString(dateString)

    return date.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    )
  }

  function getMonthTitle(dateString) {
    const date =
      createDateFromString(dateString)

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    )
  }

  const today = getTodayString()

  const [selectedDate, setSelectedDate] =
    useState(today)

  const [showForm, setShowForm] =
    useState(false)

  const [editingEvent, setEditingEvent] =
    useState(null)

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] =
    useState('')

  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const dates =
    getWeekDates(selectedDate)

  const API_URL =
    'http://localhost:5000/api/events'

  function getHeaders() {
    const token =
      localStorage.getItem('token')

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  function goToPreviousWeek() {
    const date =
      createDateFromString(selectedDate)

    date.setDate(
      date.getDate() - 7
    )

    setSelectedDate(
      formatDate(date)
    )
  }

  function goToNextWeek() {
    const date =
      createDateFromString(selectedDate)

    date.setDate(
      date.getDate() + 7
    )

    setSelectedDate(
      formatDate(date)
    )
  }

  function goToToday() {
    setSelectedDate(today)
  }

  function openAddForm() {
    setEditingEvent(null)
    setTitle('')
    setTime('')
    setDescription('')
    setError('')
    setShowForm(true)
  }

  function openEditForm(event) {
    setEditingEvent(event)
    setTitle(event.title)
    setTime(event.time || '')
    setDescription(
      event.description || ''
    )
    setError('')
    setShowForm(true)
  }

  async function saveEvent(event) {
    event.preventDefault()

    if (title.trim() === '') {
      setError(
        'Event name is required.'
      )
      return
    }

    setSaving(true)
    setError('')

    try {
      const eventData = {
        title: title.trim(),
        date: editingEvent
          ? editingEvent.date
          : selectedDate,
        time: time || '',
        description:
          description.trim(),
      }

      let response

      if (editingEvent) {
        response = await fetch(
          `${API_URL}/${editingEvent._id}`,
          {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(
              eventData
            ),
          }
        )
      } else {
        response = await fetch(
          API_URL,
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(
              eventData
            ),
          }
        )
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to save event'
        )
      }

      if (editingEvent) {
        setEvents(
          events.map((item) =>
            item._id ===
            editingEvent._id
              ? data
              : item
          )
        )
      } else {
        setEvents([
          ...events,
          data,
        ])
      }

      closeForm()
    } catch (error) {
      console.error(
        'Save event error:',
        error
      )

      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  function closeForm() {
    setShowForm(false)
    setEditingEvent(null)
    setTitle('')
    setTime('')
    setDescription('')
    setError('')
  }

  async function deleteEvent(id) {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this event?'
      )

    if (!confirmed) {
      return
    }

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: 'DELETE',
            headers: getHeaders(),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to delete event'
        )
      }

      setEvents(
        events.filter(
          (event) =>
            event._id !== id
        )
      )
    } catch (error) {
      console.error(
        'Delete event error:',
        error
      )

      alert(error.message)
    }
  }

  const selectedEvents =
    events
      .filter(
        (event) =>
          event.date ===
          selectedDate
      )
      .sort((a, b) =>
        (a.time || '').localeCompare(
          b.time || ''
        )
      )

  const selectedTasks =
    tasks.filter(
      (task) =>
        task.dueDate ===
        selectedDate
    )

  const selectedItemCount =
    selectedEvents.length +
    selectedTasks.length

  return (
    <div className="calendar-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>
            Calendar 📅
          </h1>

          <p>
            View your tasks and
            activities by date.
          </p>
        </div>

        <button
          className="calendar-add-button"
          onClick={openAddForm}
        >
          + Add Event
        </button>
      </div>


      {/* ADD EVENT FORM */}

      {showForm && (
        <form
          className="calendar-form"
          onSubmit={saveEvent}
        >
          <div className="form-header">
            <div>
              <h2>
                {editingEvent
                  ? 'Edit Event'
                  : 'Add New Event'}
              </h2>

              <p>
                {editingEvent
                  ? 'Update your event details.'
                  : `Add an event for ${formatSelectedDate(
                      selectedDate
                    )}.`}
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

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <div className="calendar-form-grid">

            <label>
              Event Name

              <input
                type="text"
                placeholder="Example: College class"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Time

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
              />
            </label>

            <label className="full-width">
              Description

              <textarea
                placeholder="Add some details..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
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
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingEvent
                ? 'Update Event'
                : 'Save Event'}
            </button>

          </div>
        </form>
      )}


      {/* CALENDAR */}

      <div className="calendar-card">

        <div className="calendar-top">

          <button
            type="button"
            onClick={
              goToPreviousWeek
            }
            aria-label="Previous week"
          >
            ‹
          </button>

          <div className="calendar-month-title">
            <h2>
              {getMonthTitle(
                selectedDate
              )}
            </h2>

            <button
              type="button"
              className="calendar-today-button"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <button
            type="button"
            onClick={
              goToNextWeek
            }
            aria-label="Next week"
          >
            ›
          </button>

        </div>


        {/* WEEK */}

        <div className="calendar-week">

          {dates.map((item) => {
            const isToday =
              item.date === today

            const hasEvents =
              events.some(
                (event) =>
                  event.date ===
                  item.date
              )

            const hasTasks =
              tasks.some(
                (task) =>
                  task.dueDate ===
                  item.date
              )

            return (
              <button
                type="button"
                className={`calendar-day ${
                  selectedDate ===
                  item.date
                    ? 'selected-day'
                    : ''
                } ${
                  isToday
                    ? 'today-day'
                    : ''
                }`}
                key={item.date}
                onClick={() =>
                  setSelectedDate(
                    item.date
                  )
                }
              >
                <span>
                  {item.name}
                </span>

                <strong>
                  {item.day}
                </strong>

                {(hasEvents ||
                  hasTasks) && (
                  <small>
                    •
                  </small>
                )}
              </button>
            )
          })}

        </div>


        {/* SELECTED DATE */}

        <div className="selected-date-heading">

          <div>
            <h3>
              {formatSelectedDate(
                selectedDate
              )}
            </h3>

            <p>
              {selectedItemCount}{' '}
              item
              {selectedItemCount !==
              1
                ? 's'
                : ''}{' '}
              scheduled
            </p>
          </div>

        </div>


        {/* EVENTS */}

        <div className="calendar-events">

          {selectedEvents.map(
            (event) => (
              <div
                className="calendar-event"
                key={event._id}
              >
                <span className="event-time">
                  {event.time ||
                    'Any time'}
                </span>

                <div className="event-content">
                  <strong>
                    {event.title}
                  </strong>

                  <p>
                    {event.description ||
                      'No description'}
                  </p>
                </div>

                <div className="calendar-event-actions">

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(
                        event
                      )
                    }
                    aria-label="Edit event"
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteEvent(
                        event._id
                      )
                    }
                    aria-label="Delete event"
                  >
                    🗑️
                  </button>

                </div>

              </div>
            )
          )}


          {/* TASKS ON THIS DATE */}

          {selectedTasks.map(
            (task) => (
              <div
                className="calendar-task"
                key={`task-${
                  task._id ||
                  task.id
                }`}
              >
                <span className="calendar-task-icon">
                  {task.completed
                    ? '✅'
                    : '📋'}
                </span>

                <div>
                  <strong>
                    {task.title}
                  </strong>

                  <p>
                    Task ·{' '}
                    {task.priority}{' '}
                    priority
                  </p>
                </div>

              </div>
            )
          )}


          {/* EMPTY */}

          {selectedEvents.length ===
            0 &&
            selectedTasks.length ===
              0 && (
              <div className="calendar-empty">

                <span>
                  📅
                </span>

                <h3>
                  No events or tasks
                </h3>

                <p>
                  Your schedule is
                  clear for this
                  date.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddForm
                  }
                >
                  + Add Event
                </button>

              </div>
            )}

        </div>

      </div>

    </div>
  )
}

export default Calendar