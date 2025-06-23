import { Toaster } from "react-hot-toast";
import { Route, Switch } from "wouter";
import { Dock } from "~/components/Dock";
import { Navbar } from "~/components/Navbar";
import { useThemes } from "~/hooks/use-themes";
import { Landing } from "~/routes/Landing.tsx";
import { Manage } from "~/routes/Manage";
import { Viz } from "~/routes/Viz";

function App() {
	const { themeName } = useThemes();
	return (
		<div className="min-h-screen max-w-full mx-auto" data-theme={themeName}>
			<Toaster />
			<Navbar />
			<div className="max-w-4xl mx-auto">
				<Switch>
					<Route path="/" component={Landing} />
					<Route path="/manage" component={Manage} />
					<Route path="/viz" component={Viz} />
				</Switch>
			</div>
			<Dock />
		</div>
	);
}

export default App;
