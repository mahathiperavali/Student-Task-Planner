function Settings({ settings, setSettings }) {
  function updateSetting(key, value) {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings ⚙️</h1>
          <p>Customize your Student Planner.</p>
        </div>
      </div>

      {/* Profile */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>👤 Profile</h2>
            <p>Set the name you want to see in your planner.</p>
          </div>
        </div>

        <div className="settings-card">
          <label className="settings-field">
            Your Name
            <input
              type="text"
              value={settings.name}
              onChange={(event) =>
                updateSetting('name', event.target.value)
              }
              placeholder="Enter your name"
            />
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>🔔 Notifications</h2>
            <p>Control reminder and notification settings.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <div>
              <h3>Enable Notifications</h3>
              <p>
                Allow the planner to show reminder notifications.
              </p>
            </div>

            <button
              className={`toggle-button ${
                settings.notifications ? 'toggle-on' : ''
              }`}
              onClick={() =>
                updateSetting(
                  'notifications',
                  !settings.notifications
                )
              }
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>🎨 Appearance</h2>
            <p>Change how information is displayed.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <div>
              <h3>Compact Mode</h3>
              <p>
                Reduce spacing to show more information on the screen.
              </p>
            </div>

            <button
              className={`toggle-button ${
                settings.compactMode ? 'toggle-on' : ''
              }`}
              onClick={() =>
                updateSetting(
                  'compactMode',
                  !settings.compactMode
                )
              }
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      {/* Current settings */}
      <section className="settings-section">
        <div className="settings-card settings-info-card">
          <div className="settings-info-icon">💡</div>

          <div>
            <h3>Your settings are saved automatically</h3>
            <p>
              You don't need to click a Save button. Your preferences
              are stored in your browser automatically.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Settings