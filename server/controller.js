import connection from "./connection.js";

export const getSurvey = async (req, res) => {
    const id = req.params.id;

    try {
        const [result, _] = await connection.query(
            `SELECT * FROM surveys WHERE id=?;`, [id]
        );
        // for debug
        // console.log(result);

        if (result.length === 0) return res.status(404).json({ message: "Survey not found." });
        return res.status(200).json(result);

    } catch (error) {
        // for debug
        // console.log(error);

        return res.status(500).json({ message: "Server error." });
    }
}

export const getQuestions = async (req, res) => {
    const id = req.params.id;
    try {
        const [results, _] = await connection.query(
            `SELECT * FROM questions WHERE survey_id=?;`, [id]
        );
        // for debug
        // console.log(results);
        if (results.length === 0) return res.status(404).json({ message: "Questions not found." });
        return res.status(200).json(results);
    } catch (error) {
        // for debug
        // console.log(error);

        return res.status(500).json({ message: "Server error." });
    }
}

export const postAnswer = async (req, res) => {
    const survey_id = req.body.survey_id;
    const ans = req.body.answers;
    try {
        if (!ans || typeof ans !== "object")
            return res.status(400).json({ message: "invalid answers." });

        // start transaction
        await connection.beginTransaction();

        // add new respondent to database
        const [result, _] = await connection.query(
            `INSERT INTO respondents (survey_id) VALUES (?);`, [survey_id]
        );
        const respondent_id = result.insertId;

        // convert answer from object to array and add respondent_id
        const answers = Object.entries(ans).map(([question_id, value]) => [respondent_id, question_id, value]);

        // add answers to database
        await connection.query(
            `INSERT INTO answers (respondent_id, question_id, answer) VALUES ?`, [answers]
        );

        // commit if success
        await connection.commit();

        return res.status(201).json({ message: "Answers saved." });

    } catch (error) {
        // rollback if error
        await connection.rollback();

        // for debug
        // console.log(error);

        return res.status(500).json({ message: "Server error." });
    }
}