import { useState } from 'react'

function Tasks({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('College')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('Medium')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:5000/api/tasks'

  function getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }

  function openAddForm() {
    setEditingTask(null)
    setTitle('')
    setCategory('College')
    setDueDate('')
    setPriority('Medium')
    setError('')
    setShowForm(true)
  }

  function openEditForm(task) {
    setEditingTask(task)
    setTitle(task.title)
    setCategory(task.category)
    setDueDate(task.dueDate === 'No date' ? '' : task.dueDate)
    setPriority(task.priority)
    setError('')
    setShowForm(true)
  }

  async function saveTask(event) {
    event.preventDefault()

    if (title.trim() === '') {
      setError('Please enter a task name.')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (editingTask) {
        const taskId = editingTask._id || editingTask.id

        const response = await fetch(`${API_URL}/${taskId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({
            title: title.trim(),
            category,
            dueDate: dueDate || 'No date',
            priority,
          }),
        })

        const updatedTask = await response.json()

        if (!response.ok) {
          throw new Error(
            updatedTask.message || 'Failed to update task'
          )
        }

        setTasks(
          tasks.map((task) =>
            (task._id || task.id) === taskId
              ? updatedTask
              : task
          )
        )
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            title: title.trim(),
            category,
            dueDate: dueDate || 'No date',
            priority,
          }),
        })

        const newTask = await response.json()

        if (!response.ok) {
          throw new Error(
            newTask.message || 'Failed to create task'
          )
        }

        setTasks([newTask, ...tasks])
      }

      closeForm()
    } catch (error) {
      console.error('Save task error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function closeForm() {
    setShowForm(false)
    setEditingTask(null)
    setTitle('')
    setCategory('College')
    setDueDate('')
    setPriority('Medium')
    setError('')
  }

  async function toggleTask(task) {
    const taskId = task._id || task.id

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          completed: !task.completed,
        }),
      })

      const updatedTask = await response.json()

      if (!response.ok) {
        throw new Error(
          updatedTask.message || 'Failed to update task'
        )
      }

      setTasks(
        tasks.map((currentTask) =>
          (currentTask._id || currentTask.id) === taskId
            ? updatedTask
            : currentTask
        )
      )
    } catch (error) {
      console.error('Complete task error:', error)
      alert(error.message)
    }
  }

  async function deleteTask(task) {
    const taskId = task._id || task.id

    const shouldDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!shouldDelete) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete task'
        )
      }

      setTasks(
        tasks.filter(
          (currentTask) =>
            (currentTask._id || currentTask.id) !== taskId
        )
      )
    } catch (error) {
      console.error('Delete task error:', error)
      alert(error.message)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed)

    const searchText = search.toLowerCase()

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.category.toLowerCase().includes(searchText)

    return matchesFilter && matchesSearch
  })

  const totalTasks = tasks.length

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length

  return (
    <div className="tasks-page">

      <div className="page-header">
        <div>
          <h1>Tasks ✅</h1>
          <p>
            Manage your assignments and study tasks.
          </p>
        </div>

        <button
          className="task-add-button"
          onClick={openAddForm}
        >
          + Add Task
        </button>
      </div>

      <div className="task-summary">

        <div className="task-summary-card">
          <span>📋</span>
          <div>
            <strong>{totalTasks}</strong>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="task-summary-card">
          <span>⏳</span>
          <div>
            <strong>{pendingTasks}</strong>
            <p>Pending</p>
          </div>
        </div>

        <div className="task-summary-card">
          <span>✅</span>
          <div>
            <strong>{completedTasks}</strong>
            <p>Completed</p>
          </div>
        </div>

      </div>

      {showForm && (
        <form
          className="task-form"
          onSubmit={saveTask}
        >
          <div className="form-header">
            <div>
              <h2>
                {editingTask
                  ? 'Edit Task'
                  : 'Add New Task'}
              </h2>

              <p>
                Enter the details for your task.
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

          <div className="form-grid">

            <label>
              Task Name

              <input
                type="text"
                placeholder="Example: Complete React assignment"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </label>

            <label>
              Category

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>College</option>
                <option>Study</option>
                <option>Personal</option>
                <option>Project</option>
              </select>
            </label>

            <label>
              Due Date

              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
              />
            </label>

            <label>
              Priority

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

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
                : editingTask
                  ? 'Update Task'
                  : 'Save Task'}
            </button>

          </div>
        </form>
      )}

      <div className="task-toolbar">

        <div className="task-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="task-filters">

          <button
            className={
              filter === 'all'
                ? 'filter-active'
                : ''
            }
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={
              filter === 'pending'
                ? 'filter-active'
                : ''
            }
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>

          <button
            className={
              filter === 'completed'
                ? 'filter-active'
                : ''
            }
            onClick={() =>
              setFilter('completed')
            }
          >
            Completed
          </button>

        </div>

      </div>

      <div className="tasks-card">

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {

            const taskId = task._id || task.id

            return (
              <div
                className={`task-item ${
                  task.completed
                    ? 'task-completed'
                    : ''
                }`}
                key={taskId}
              >

                <button
                  className={`task-checkbox ${
                    task.completed
                      ? 'checked'
                      : ''
                  }`}
                  onClick={() =>
                    toggleTask(task)
                  }
                >
                  {task.completed ? '✓' : ''}
                </button>

                <div className="task-info">

                  <h3
                    className={
                      task.completed
                        ? 'completed-task'
                        : ''
                    }
                  >
                    {task.title}
                  </h3>

                  <div className="task-details">

                    <span>
                      🏷️ {task.category}
                    </span>

                    <span>
                      📅{' '}
                      {task.dueDate === 'No date'
                        ? 'No date'
                        : task.dueDate}
                    </span>

                    <span
                      className={`priority-${task.priority.toLowerCase()}`}
                    >
                      ● {task.priority}
                    </span>

                  </div>

                </div>

                <div className="task-actions">

                  <button
                    className="edit-task"
                    onClick={() =>
                      openEditForm(task)
                    }
                    title="Edit task"
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-task"
                    onClick={() =>
                      deleteTask(task)
                    }
                    title="Delete task"
                  >
                    🗑️
                  </button>

                </div>

              </div>
            )
          })
        ) : (

          <div className="empty-tasks">

            <div className="empty-icon">
              🎉
            </div>

            <h3>
              {search
                ? 'No matching tasks'
                : filter === 'completed'
                  ? 'No completed tasks'
                  : filter === 'pending'
                    ? 'No pending tasks'
                    : 'No tasks yet'}
            </h3>

            <p>
              {search
                ? 'Try a different search.'
                : 'Add a task to start planning your day.'}
            </p>

          </div>

        )}

      </div>

    </div>
  )
}

export default Tasks