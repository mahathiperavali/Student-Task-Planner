function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    {
      id: 'dashboard',
      icon: '🏠',
      label: 'Dashboard',
    },
    {
      id: 'calendar',
      icon: '📅',
      label: 'Calendar',
    },
    {
      id: 'tasks',
      icon: '✅',
      label: 'Tasks',
    },
    {
      id: 'reminders',
      icon: '🔔',
      label: 'Reminders',
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
    },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">📚</span>
        <span>Student Planner</span>
      </div>

      <nav className="navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={currentPage === item.id ? 'active' : ''}
            onClick={() => setCurrentPage(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-tip">
          💡
          <span>
            Plan today.
            <br />
            Relax tomorrow.
          </span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar