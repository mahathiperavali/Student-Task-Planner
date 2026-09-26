function Dashboard({
  tasks,
  events,
  reminders,
  totalTasks,
  completedTasks,
  pendingTasks,
  dueToday,
  completionPercentage,
  setCurrentPage,
}) {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  const formattedDate = today.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  )

  const todayEvents = events
    .filter((event) => event.date === todayString)
    .sort((a, b) =>
      (a.time || '').localeCompare(b.time || '')
    )

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .slice(0, 4)

  const upcomingReminders = reminders
    .filter((reminder) => !reminder.completed)
    .slice(0, 4)

  return (
    <div className="dashboard">

      {/* HERO HEADER */}

      <div className="dashboard-hero">

        <div>
          <span className="dashboard-eyebrow">
            STUDENT TASK PLANNER
          </span>

          <h1>
            Good Morning! <span>👋</span>
          </h1>

          <p>
            Here's your plan for today. Stay focused
            and keep moving forward.
          </p>
        </div>

        <div className="dashboard-date-card">
          <span>📅</span>

          <div>
            <strong>{formattedDate}</strong>
            <small>Today's overview</small>
          </div>
        </div>

      </div>


      {/* STATISTICS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card tasks-stat">

          <div className="stat-icon">
            📋
          </div>

          <div className="stat-content">
            <span>Tasks Remaining</span>
            <strong>{pendingTasks}</strong>
            <small>
              {totalTasks === 0
                ? 'No tasks yet'
                : `${totalTasks} total tasks`}
            </small>
          </div>

        </div>


        <div className="dashboard-stat-card today-stat">

          <div className="stat-icon">
            ⏰
          </div>

          <div className="stat-content">
            <span>Due Today</span>
            <strong>{dueToday}</strong>
            <small>
  {dueToday === 0
    ? "You're all clear"
    : 'Needs your attention'}
</small>
          </div>

        </div>


        <div className="dashboard-stat-card completed-stat">

          <div className="stat-icon">
            ✅
          </div>

          <div className="stat-content">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
            <small>
              {completionPercentage}% overall progress
            </small>
          </div>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">


        {/* PROGRESS */}

        <section className="dashboard-card progress-card">

          <div className="dashboard-card-header">

            <div>
              <span className="card-label">
                PRODUCTIVITY
              </span>

              <h2>Today's Progress</h2>
            </div>

            <div className="progress-circle">
              <strong>
                {completionPercentage}%
              </strong>
            </div>

          </div>

          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          <div className="progress-footer">
            <span>
              {completedTasks} of {totalTasks} tasks completed
            </span>

            <span>
              {pendingTasks} remaining
            </span>
          </div>

        </section>


        {/* TODAY'S SCHEDULE */}

        <section className="dashboard-card schedule-card">

          <div className="dashboard-card-header">

            <div>
              <span className="card-label">
                SCHEDULE
              </span>

              <h2>Today's Schedule</h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage('calendar')
              }
            >
              Calendar →
            </button>

          </div>

          <div className="dashboard-list">

            {todayEvents.length > 0 ? (
              todayEvents.slice(0, 4).map((event) => (

                <div
                  className="dashboard-list-item"
                  key={event._id}
                >

                  <div className="schedule-time">
                    {event.time || 'Any time'}
                  </div>

                  <div className="schedule-dot" />

                  <div className="schedule-info">
                    <strong>
                      {event.title}
                    </strong>

                    {event.description && (
                      <span>
                        {event.description}
                      </span>
                    )}
                  </div>

                </div>

              ))
            ) : (

              <div className="dashboard-empty">
                <div className="empty-icon">
                  📅
                </div>

                <strong>
                  No events today
                </strong>

                <span>
                  Your schedule is clear.
                </span>
              </div>

            )}

          </div>

        </section>


        {/* UPCOMING TASKS */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <span className="card-label">
                TASKS
              </span>

              <h2>Upcoming Tasks</h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage('tasks')
              }
            >
              View all →
            </button>

          </div>

          <div className="dashboard-list">

            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (

                <div
                  className="dashboard-task-item"
                  key={task._id}
                >

                  <div className="task-status-dot" />

                  <div className="dashboard-task-info">

                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      📅 {task.dueDate || 'No date'}
                    </span>

                  </div>

                  <span
                    className={`priority-badge ${
                      task.priority?.toLowerCase() ||
                      'medium'
                    }`}
                  >
                    {task.priority || 'Medium'}
                  </span>

                </div>

              ))
            ) : (

              <div className="dashboard-empty">
                <div className="empty-icon">
                  🎉
                </div>

                <strong>
                  All tasks completed!
                </strong>

                <span>
                  Great work. Keep it going!
                </span>
              </div>

            )}

          </div>

        </section>


        {/* REMINDERS */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <span className="card-label">
                REMINDERS
              </span>

              <h2>Don't Forget</h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage('reminders')
              }
            >
              View all →
            </button>

          </div>

          <div className="dashboard-list">

            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((reminder) => (

                <div
                  className="dashboard-reminder-item"
                  key={reminder._id}
                >

                  <div className="reminder-status-icon">
                    🔔
                  </div>

                  <div className="dashboard-reminder-info">

                    <strong>
                      {reminder.title}
                    </strong>

                    <span>
                      📅 {reminder.date}
                      {' · '}
                      {reminder.time || 'Any time'}
                    </span>

                  </div>

                </div>

              ))
            ) : (

              <div className="dashboard-empty">
                <div className="empty-icon">
                  🔕
                </div>

                <strong>
                  No upcoming reminders
                </strong>

                <span>
                  You're all caught up!
                </span>
              </div>

            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Dashboard