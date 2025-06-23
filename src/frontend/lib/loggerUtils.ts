import type { Console } from "@evolu/common";

export interface Logger {
	readonly log: (message?: unknown, ...optionalParams: unknown[]) => void;
}

export interface LoggerDep {
	readonly logger: Logger;
}

export const createLogger = (c: Console): Logger => ({
	log: (...args) => {
		c.log(...args);
	},
});
