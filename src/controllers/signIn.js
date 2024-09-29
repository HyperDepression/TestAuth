import db from "../db.js";
import redis from "../redis.js";
import { hash } from "node:crypto"
const lifetime = Number(process.env.REDIS_LIFETIME)

export default async (req, res) => {
    const { user: login } = req.body;
    const password = hash("sha256", req.body.password);

    try {
        const record = await redis.get(login);
        if (record) {
            if (password !== record) return res.status(422).json({ message: "Invalid password" });
            else return res.status(204).json();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal error' });
    }

    const data = await db.user.findUnique({ where: { login } });

    if (!data) return res.status(404).json({ message: "User not found" });
    if (password !== data.password) return res.status(422).json({ message: "Invalid password" });

    try {
        await redis.set(data.login, data.password, 'EX', lifetime);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal error' });
    }

    return res.status(204).json();
}