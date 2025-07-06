import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import type { Themes } from "~/constants";
import type { Item, ItemId } from "~/lib/schema";

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
				dailyToggles: [] as ItemId[],
			},
			(set) => ({
				setThemeName: (themeName: Themes | null) => set({ themeName }),
				togglePlaySounds: () =>
					set((state) => ({ playSounds: !state.playSounds })),
				setDailyToggles: (dailyToggles: ItemId[]) => set({ dailyToggles }),
			}),
		),
		{ name: "zustand-store", storage: createJSONStorage(() => localStorage) },
	),
);
