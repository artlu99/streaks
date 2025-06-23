import { type ReactNode, createContext, useEffect, useState } from "react";
import { useLocalStorageZustand } from "~/hooks/use-zustand";

// Audio file paths
const audioFiles = {
	click: "/assets/click-345983.mp3",
	clear: "/assets/notification-1-reversed-317859.mp3",
	success: "/assets/level_clear-345988.mp3",
} as const;

type AudioType = keyof typeof audioFiles;

export interface AudioContextType {
	playAudio: (type: AudioType, invertPlayLogic?: boolean) => void;
	isAudioLoaded: boolean;
}

export const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
	children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
	const [isAudioLoaded, setIsAudioLoaded] = useState(false);
	const [audioInstances, setAudioInstances] = useState<
		Record<AudioType, HTMLAudioElement>
	>({} as Record<AudioType, HTMLAudioElement>);

	const { playSounds } = useLocalStorageZustand();

	useEffect(() => {
		const instances = {
			click: new Audio(audioFiles.click),
			clear: new Audio(audioFiles.clear),
			success: new Audio(audioFiles.success),
		};

		// Pre-load all audio files
		const loadPromises = Object.values(instances).map((audio) => {
			return new Promise<void>((resolve) => {
				audio.addEventListener("canplaythrough", () => resolve(), {
					once: true,
				});
				audio.addEventListener("error", () => resolve(), { once: true }); // Resolve even on error to not block the app
				audio.load();
			});
		});

		Promise.all(loadPromises).then(() => {
			setAudioInstances(instances);
			setIsAudioLoaded(true);
		});
	}, []);

	const playAudio = (type: AudioType, invertLogic?: boolean) => {
		if (invertLogic ? playSounds : !playSounds) {
			return;
		}
		try {
			const audio = audioInstances[type];
			if (audio) {
				// Reset to beginning in case it was already played
				audio.currentTime = 0;
				audio.play().catch((error) => {
					console.warn(`Failed to play audio ${type}:`, error);
				});
			}
		} catch (error) {
			console.warn(`Error playing audio ${type}:`, error);
		}
	};

	const value: AudioContextType = {
		playAudio,
		isAudioLoaded,
	};

	return (
		<AudioContext.Provider value={value}>{children}</AudioContext.Provider>
	);
};
