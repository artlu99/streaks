import { createContext, useCallback } from "react";
import type { Themes } from "~/constants";
import { useLocalStorageZustand } from "../hooks/use-zustand";

export interface ThemesContextType {
	themeName: Themes | null;
	setTheme: (name: Themes | null) => void;
}

export const ThemesContext = createContext<ThemesContextType>({
	themeName: null,
	setTheme: () => {},
});

export function ThemesProvider({ children }: { children: React.ReactNode }) {
	const { themeName, setThemeName } = useLocalStorageZustand();

	const setTheme = useCallback(
		(name: Themes | null) => {
			setThemeName(name);
		},
		[setThemeName],
	);

	return (
		<ThemesContext.Provider value={{ themeName, setTheme }}>
			{children}
		</ThemesContext.Provider>
	);
}
