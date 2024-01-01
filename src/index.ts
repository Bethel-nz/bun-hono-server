import { Hono } from "hono";
import {logger} from 'hono/logger'
import route from "./routes/routes";

const app = new Hono().basePath('/api/v1');
app.use('*',logger())
app.route('/movie',route)

Bun.serve({
	fetch:app.fetch,
	port:process.env.PORT
})