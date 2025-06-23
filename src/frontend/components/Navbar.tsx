import { Link } from "wouter";
import { useNameQuery } from "~/hooks/queries/useOpenBackend";
import { useSounds } from "~/hooks/use-sounds";
import { useLocalStorageZustand } from "~/hooks/use-zustand";
import { ThemeButton } from "./ThemeButton";

export const Navbar = () => {
	const { data } = useNameQuery();
	const { playSounds, togglePlaySounds } = useLocalStorageZustand();
	const { playAudio } = useSounds();

	const handleClick = () => {
		playAudio("success", true);
		togglePlaySounds();
	};

	return (
		<nav className="navbar max-w-lg">
			<div className="navbar-start">
				<Link to="/" className="btn btn-ghost text-xl relative">
					{data?.name} <span className="text-secondary">{data?.version}</span>
					{data?.isBeta && (
						<span className="badge badge-xs badge-info badge-outline absolute -top-2 -right-4">
							BETA
						</span>
					)}
				</Link>
			</div>

			<div className="navbar-end">
				<button type="button" className="btn btn-ghost" onClick={handleClick}>
					<i
						className={`fa-solid ${playSounds ? "fa-volume-high" : "fa-volume-xmark"} text-2xl`}
					/>
				</button>
				<ThemeButton />
			</div>
		</nav>
	);
};
