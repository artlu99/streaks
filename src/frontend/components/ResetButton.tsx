import { useMemo } from "react";
import { MAX_ITEMS } from "~/constants";
import { useSounds } from "~/hooks/use-sounds";
import { useLocalStorageZustand } from "~/hooks/use-zustand";

export const ResetButton = () => {
	const { dailyToggles, setDailyToggles } = useLocalStorageZustand();
	const { playAudio } = useSounds();

	const handleClick = () => {
		setDailyToggles([...Array(MAX_ITEMS)].map(() => false));
		if ("vibrate" in navigator) {
			navigator.vibrate(200);
		}

		playAudio("clear");
	};

	const numToggles = useMemo(() => {
		return dailyToggles.filter(Boolean).length;
	}, [dailyToggles]);

	return (
		<div className="card w-full max-w-sm justify-center items-center m-8">
			{numToggles > 0 && (
				<button
					className="btn btn-lg btn-wide btn-warning"
					type="button"
					onClick={handleClick}
				>
					New Day / Lock In
				</button>
			)}
		</div>
	);
};
