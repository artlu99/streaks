import { Themes } from "~/constants";
import { useSounds } from "~/hooks/use-sounds";
import { useThemes } from "~/hooks/use-themes";

export const ThemeButton = () => {
	const { themeName, setTheme } = useThemes();
	const { playAudio } = useSounds();

	const toggleTheme = () => {
		setTheme(themeName !== Themes.LIGHT ? Themes.LIGHT : Themes.DARK);

		if ("vibrate" in navigator) {
			navigator.vibrate(100);
		}

		playAudio("click");
	};

	return (
		<button
			type="button"
			className="btn btn-square btn-ghost m-1 transition-all duration-300"
			onClick={() => toggleTheme()}
		>
			{themeName === Themes.DARK ? (
				<i className="fa-solid fa-sun text-2xl text-primary-content" />
			) : (
				<i className="fa-solid fa-moon text-2xl text-secondary" />
			)}
		</button>
	);
};
