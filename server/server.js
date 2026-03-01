import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { surveyRouter, questionRouter, answerRouter, resultRouter } from './router.js'

const server = express();

server.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

server.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`)
});

// for test server
server.get("/", (_, res) => { res.send("server is running") });

// apis
server.use("/api/surveys", express.json(), surveyRouter);
server.use("/api/questions", express.json(), questionRouter);
server.use("/api/answers", express.json(), answerRouter);
server.use("/api/results", express.json(), resultRouter);

