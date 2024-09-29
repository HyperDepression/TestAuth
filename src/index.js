import express from "express";
import router from "./routes.js";
import redis from "./redis.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/', router);

const start = async () => {
    try {
        const server = app.listen(PORT, () => console.log('Server started on port', PORT));
        const close = async () => {
            server.close()
            await redis.quit()
            console.log("Server gracefully stopped");
        }
        process.on("SIGINT", close)
        process.on("SIGTERM", close)
    }
    catch (e) {
        console.error(e);
    }
}

start();

