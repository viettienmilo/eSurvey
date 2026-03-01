import express from 'express'

import { getSurvey, getQuestions, postAnswer, getStats, getPlot1Data, getPlot2Data } from './controller.js';

const surveyRouter = express.Router();
const questionRouter = express.Router();
const answerRouter = express.Router();
const resultRouter = express.Router();

surveyRouter.get("/:id", getSurvey);
questionRouter.get("/:id", getQuestions);
answerRouter.post("/send-answer", postAnswer);
resultRouter.get("/:id1/:id2/:id3", getPlot1Data);
resultRouter.get("/:id1/:id2/:id3/percentage", getPlot2Data);
resultRouter.get("/stats/:id", getStats);

export { surveyRouter, questionRouter, answerRouter, resultRouter };