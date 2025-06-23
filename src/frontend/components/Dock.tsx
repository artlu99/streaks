import { Link, useLocation } from "wouter";

export const Dock = () => {
	const [pathname] = useLocation();

	return (
		<div className="dock dock-xs bg-base-100/50">
			<div className={`dock-item ${pathname === "/" ? "dock-active" : ""}`}>
				<Link to="/">
					<i className="fa-solid fa-house" />
				</Link>
			</div>

			<div className={`dock-item ${pathname === "/viz" ? "dock-active" : ""}`}>
				<Link to="/viz">
					<i className="fa-solid fa-chart-line" />
				</Link>
			</div>

			<div
				className={`dock-item ${pathname === "/manage" ? "dock-active" : ""}`}
			>
				<Link to="/manage">
					<i className="fa-solid fa-list-ul" />
				</Link>
			</div>
		</div>
	);
};
