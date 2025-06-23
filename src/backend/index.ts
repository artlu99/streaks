import type { AppName } from "@shared/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono<{ Bindings: Cloudflare.Env }>().basePath("/api");

app
	.use(cors())
	.use(csrf())
	.use(secureHeaders())
	.get("/name", async (c) => {
		const res: AppName = {
			name: c.env.NAME,
			version: c.env.VERSION,
			isBeta: true,
		};
		return c.json(res);
	});

export default app;
