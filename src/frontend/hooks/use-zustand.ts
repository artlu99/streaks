import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { MAX_ITEMS, type Themes } from "~/constants";
import type { Item } from "~/lib/schema";

export const useZustand = create(
	persist(
		combine(
			{ isEvoluReady: false, selectedItem: null as Item | null },
			(set) => ({
				setIsEvoluReady: (isEvoluReady: boolean) => set({ isEvoluReady }),
				setSelectedItem: (item: Item | null) => set({ selectedItem: item }),
			}),
		),
		{ name: "zustand", storage: createJSONStorage(() => sessionStorage) },
	),
);

export const useLocalStorageZustand = create(
	persist(
		combine(
			{
				themeName: null as Themes | null,
				playSounds: true,
				dailyToggles: [...Array(MAX_ITEMS)].map(() => false) as boolean[],
			},
			(set) => ({
				setThemeName: (themeName: Themes | null) => set({ themeName }),
				togglePlaySounds: () =>
					set((state) => ({ playSounds: !state.playSounds })),
				setDailyToggles: (dailyToggles: boolean[]) => set({ dailyToggles }),
			}),
		),
		{ name: "zustand-store", storage: createJSONStorage(() => localStorage) },
	),
);
