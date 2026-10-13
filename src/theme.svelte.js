// light/dark theme: index.html sets the initial data-theme before the first paint;
// this keeps it in sync with the toggle and, until the user picks one, the system setting
const STORAGE_KEY = 'theme';
const THEME_COLORS = {light: '#DBE1D5', dark: '#1b1f1a'};

const readSaved = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        return null;
    }
};

const apply = (dark) => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
};

export const theme = $state({dark: document.documentElement.dataset.theme === 'dark'});

// follow system changes as long as the user hasn't chosen a theme
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (readSaved()) return;
    theme.dark = event.matches;
    apply(theme.dark);
});

export function toggleTheme() {
    theme.dark = !theme.dark;
    apply(theme.dark);
    try {
        localStorage.setItem(STORAGE_KEY, theme.dark ? 'dark' : 'light');
    } catch (e) {
        console.warn('localStorage unavailable, theme choice will not be persisted:', e);
    }
}
