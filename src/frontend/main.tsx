import { EvoluProvider } from "@evolu/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import invariant from "tiny-invariant";
import App from "~/App.tsx";
import { evoluInstance } from "~/lib/evolu";
import { AudioProvider } from "~/providers/AudioProvider";
import { ThemesProvider } from "~/providers/ThemesProvider";

import "@fortawesome/fontawesome-free/css/all.css";
import "./app.css";

const queryClient = new QueryClient();

const root = document.getElementById("root");
invariant(root, "Root element not found");

createRoot(root).render(
	<StrictMode>
		<EvoluProvider value={evoluInstance}>
			<QueryClientProvider client={queryClient}>
				<ThemesProvider>
					<AudioProvider>
						<App />
					</AudioProvider>
				</ThemesProvider>
			</QueryClientProvider>
		</EvoluProvider>
		;
	</StrictMode>,
);
