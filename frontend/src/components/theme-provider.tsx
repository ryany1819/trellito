import React, { createContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

type ThemeContextState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextState = {
    theme: 'system',
    setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextState>(initialState);

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() =>
        localStorage.getItem(storageKey) as Theme || defaultTheme
    );

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            setTheme(newTheme);
            localStorage.setItem(storageKey, newTheme);
        }
    }

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    );
};