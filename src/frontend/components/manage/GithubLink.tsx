export const GithubLink = () => {
	return (
		<div className="flex items-center gap-2">
			<a
				href="https://github.com/artlu99/streaks"
				target="_blank"
				rel="noopener noreferrer"
			>
				<i className="fa-brands fa-github text-2xl" />
			</a>
			<span className="text-xs">
				FOSS by artlu 2025
				<br /> MIT License{" "}
			</span>
		</div>
	);
};
