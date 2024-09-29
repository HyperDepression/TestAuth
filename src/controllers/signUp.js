import db from "../db.js";
import redis from "../redis.js";
import { hash } from "node:crypto"
const lifetime = Number(process.env.REDIS_LIFETIME)

export default async (req, res) => {
    const { user: login } = req.body;
    const password = hash("sha256", req.body.password);

    let data;
    try {
        data = await db.user.create({ data: { login, password } });
    } catch (error) {
        console.error(error);
        return res.status(422).json({ message: 'User is already registered' });
    }

    try {
        await redis.set(data.login, data.password,'EX', lifetime);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal error' });
    }

    return res.status(201).json();
}