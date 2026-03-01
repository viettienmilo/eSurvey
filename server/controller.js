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
            `SELECT * FROM questions WHERE survey_id=? ORDER BY question_order;`, [id]
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

export const getStats = async (req, res) => {
    const survey_id = req.params.id;
    const stats = {}
    try {
        var [results, _] = await connection.query(`
            SELECT title FROM surveys WHERE id=?;`, [survey_id]);
        stats.survey_title = results[0].title;

        var [results, _] = await connection.query(`
            SELECT COUNT(*) AS question_size FROM questions WHERE survey_id=?;`, [survey_id]);
        stats.question_size = results[0].question_size;

        var [results, _] = await connection.query(`
            SELECT COUNT(*) AS survey_size FROM respondents WHERE survey_id=?;`, [survey_id]);
        stats.survey_size = results[0].survey_size;

        console.log(stats);
        return res.status(200).json(results[0]);
    } catch (error) {
        return res.status(500).json({ message: "Server error." });
    }
}

export const getPlot1Data = async (req, res) => {
    const survey_id = req.params.id1;
    const gender_question = req.params.id2;
    const question_id = req.params.id3;
    try {
        const [results, _] = await connection.query(`
            SELECT 
                d.\`Tần suất mua sắm\`,
                COALESCE(SUM(CASE WHEN g.answer = 1 THEN 1 END),0) AS "Nam",
                COALESCE(SUM(CASE WHEN g.answer = 2 THEN 1 END),0) AS "Nữ",
                COALESCE(SUM(CASE WHEN g.answer = 3 THEN 1 END),0) AS "Khác"
            FROM (
                SELECT 1 AS answer, 'Hàng ngày' AS \`Tần suất mua sắm\`
                UNION ALL SELECT 2, 'Hàng tuần' 
                UNION ALL SELECT 3, 'Hàng tháng' 
                UNION ALL SELECT 4, 'Hiếm khi' 
            ) d
            LEFT JOIN answers l 
                ON l.answer = d.answer AND l.question_id = ?
            LEFT JOIN questions q
                ON l.question_id = q.id and q.survey_id = ?
            LEFT JOIN answers g 
                ON l.respondent_id = g.respondent_id
                AND g.question_id = ?
            GROUP BY d.answer, d.\`Tần suất mua sắm\`
            ORDER BY d.answer;`,
            [question_id, survey_id, gender_question]
        );

        // for debug
        // console.log(results);

        if (results.length === 0) return res.status(400).json({ message: "Data not found." });

        return res.status(200).json(results);
    } catch (error) {

        return res.status(500).json({ message: "Server error." });
    }
}

export const getPlot2Data = async (req, res) => {
    const survey_id = req.params.id1;
    const gender_question = req.params.id2;
    const question_id = req.params.id3;
    try {
        const [results, _] = await connection.query(`
            SELECT 
                d.\`Tần suất mua sắm\`,
                COALESCE(ROUND(100 * SUM(CASE WHEN g.answer = 1 THEN 1 END) / NULLIF(COUNT(g.answer),0),2), 0) AS "Nam",
                COALESCE(ROUND(100 * SUM(CASE WHEN g.answer = 2 THEN 1 END) / NULLIF(COUNT(g.answer),0),2), 0) AS "Nữ",
                COALESCE(ROUND(100 * SUM(CASE WHEN g.answer = 3 THEN 1 END) / NULLIF(COUNT(g.answer),0),2), 0) AS "Khác"
            FROM (
                SELECT 1 AS answer, 'Hàng ngày' AS \`Tần suất mua sắm\`
                UNION ALL SELECT 2, 'Hàng tuần' 
                UNION ALL SELECT 3, 'Hàng tháng' 
                UNION ALL SELECT 4, 'Hiếm khi' 
            ) d
            LEFT JOIN answers l 
                ON l.answer = d.answer AND l.question_id = ?
            LEFT JOIN questions q
                ON l.question_id = q.id and q.survey_id = ?
            LEFT JOIN answers g 
                ON l.respondent_id = g.respondent_id
                AND g.question_id = ?
            GROUP BY d.answer, d.\`Tần suất mua sắm\`
            ORDER BY d.answer;`,
            [question_id, survey_id, gender_question]
        );

        // for debug
        // console.log(results);

        if (results.length === 0) return res.status(400).json({ message: "Data not found." });

        return res.status(200).json(results);
    } catch (error) {

        return res.status(500).json({ message: "Server error." });
    }
}