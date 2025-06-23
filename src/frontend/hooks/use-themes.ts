import { useContext } from "react";
import {
	ThemesContext,
	type ThemesContextType,
} from "~/providers/ThemesProvider";

export function useThemes(): ThemesContextType {
	const context = useContext(ThemesContext);
	if (context === undefined) {
		throw new Error("useThemes must be used within a ThemesProvider");
	}
	return context;
}
