export class ThemeService {
    constructor() {
        this.subscribers = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    initialize() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('light');
        }
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        // Immediately call with current theme
        callback(this.currentTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme-color meta tag for mobile browsers
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", theme === 'dark' ? '#1a1a1a' : '#ffffff');
        }
        
        // Notify subscribers
        this._notifySubscribers();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    // Using underscore prefix as a convention to indicate "private" method
    _notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.currentTheme));
    }
} 