import express from 'express'

import { getSurvey, getQuestions, postAnswer } from './controller.js';

const surveyRouter = express.Router();
const questionRouter = express.Router();
const answerRouter = express.Router();

surveyRouter.get("/:id", getSurvey);
questionRouter.get("/:id", getQuestions);
answerRouter.post("/send-answer", postAnswer);

export { surveyRouter, questionRouter, answerRouter };