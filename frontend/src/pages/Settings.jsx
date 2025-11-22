
import Navbar from "../components/Navbar";
import { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    email: "user@example.com",
    notifications: true,
    language: "en",
    theme: "light",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings saved:", settings);
    // Add your save settings logic here
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-[var(--border-color)] rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[var(--bg-secondary)] shadow rounded-lg p-6 border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Profile Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] shadow rounded-lg p-6 border border-[var(--border-color)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--text-secondary)]">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={settings.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-[var(--border-color)] rounded bg-[var(--bg-primary)]"
                    />
                    <label className="ml-2 block text-sm text-[var(--text-primary)]">
                      Enable notifications
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Theme
                    </label>
                    <select
                      name="theme"
                      value={settings.theme}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
