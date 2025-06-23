import type { AppName } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "itty-fetcher";

const api = fetcher({ base: "/api" });

export const useNameQuery = () => {
	return useQuery({
		queryKey: ["name"],
		queryFn: async () => {
			const res = await api.get<AppName>("/name");
			return res;
		},
	});
};
