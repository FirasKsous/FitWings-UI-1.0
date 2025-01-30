export class Settings {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'settings-container';
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="settings-header">
                <h2>Settings</h2>
                <p>Customize your FitWings experience</p>
            </div>
            <div class="settings-group">
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>Theme</h3>
                        <p>Choose between light and dark theme</p>
                    </div>
                    <div class="theme-toggle">
                        <input type="checkbox" id="themeToggle" ${this.currentTheme === 'dark' ? 'checked' : ''}>
                        <label for="themeToggle"></label>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>Units</h3>
                        <p>Choose your preferred measurement system</p>
                    </div>
                    <select id="unitsSelect" class="settings-select">
                        <option value="metric">Metric (kg, km)</option>
                        <option value="imperial">Imperial (lbs, miles)</option>
                    </select>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>Notifications</h3>
                        <p>Enable or disable push notifications</p>
                    </div>
                    <div class="toggle-switch">
                        <input type="checkbox" id="notificationsToggle">
                        <label for="notificationsToggle"></label>
                    </div>
                </div>
            </div>
        `;
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    setupEventListeners() {
        const themeToggle = this.container.querySelector('#themeToggle');
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            this.setTheme(newTheme);
        });

        // Initialize theme
        this.setTheme(this.currentTheme);
    }
} 