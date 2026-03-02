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
            `SELECT * FROM questions WHERE survey_id=? ORDER BY question_order LIMIT 5;`, [id]
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
    const stats = {};
    try {
        var [results, _] = await connection.query(`
            SELECT title FROM surveys WHERE id=?;`, [survey_id]);
        stats.survey_title = results[0].title;

        var [results, _] = await connection.query(`
            SELECT COUNT(*) AS question_size FROM questions WHERE survey_id=?;`, [survey_id]);
        stats.question_size = results[0].question_size;

        var [results, _] = await connection.query(`
            SELECT COUNT(*) AS respondents FROM respondents WHERE survey_id=?;`, [survey_id]);
        stats.respondents = results[0].respondents;

        // count gender
        var [results, _] = await connection.query(`
            SELECT
                g.label AS gender,
                COALESCE(COUNT(a.answer), 0) AS count
            FROM (
                SELECT 1 AS gender, 'Male' AS label
                UNION ALL SELECT 2, 'Female'
                UNION ALL SELECT 3, 'Other'
            ) g
            LEFT JOIN answers a
                ON a.answer = g.gender
            AND a.question_id = 1
            LEFT JOIN respondents r
                ON a.respondent_id = r.id
            AND r.survey_id = ?
            GROUP BY g.gender, g.label
            ORDER BY g.gender;`,
            [survey_id]);
        const genderMap = Object.fromEntries(results.map(item => [item.gender, item.count]));
        stats.male = genderMap.Male ?? 0;
        stats.female = genderMap.Female ?? 0;
        stats.otherGender = genderMap.Other ?? 0;

        // count age
        // "<18", "18-24", "25-34", "35-44", "45+"
        var [results, _] = await connection.query(`
            SELECT
                g.label AS age,
                COALESCE(COUNT(a.answer), 0) AS count
            FROM (
                SELECT 1 AS age, 'u18' AS label
                UNION ALL SELECT 2, 'f18t24'
                UNION ALL SELECT 3, 'f25t34'
                UNION ALL SELECT 4, 'f35t44'
                UNION ALL SELECT 5, 'over45'
            ) g
            LEFT JOIN answers a
                ON a.answer = g.age
            AND a.question_id = 2
            LEFT JOIN respondents r
                ON a.respondent_id = r.id
            AND r.survey_id = ?
            GROUP BY g.age, g.label
            ORDER BY g.age;`,
            [survey_id]);
        const ageMap = Object.fromEntries(results.map(item => [item.age, item.count]));
        stats.u18 = ageMap.u18 ?? 0;
        stats.f18t24 = ageMap.f18t24 ?? 0;
        stats.f25t34 = ageMap.f25t34 ?? 0;
        stats.f35t44 = ageMap.f35t44 ?? 0;
        stats.over45 = ageMap.over45 ?? 0;

        // count career
        // "Sinh viên/HS", "Nhân viên", "Kinh doanh", "Khác"
        var [results, _] = await connection.query(`
            SELECT
                g.label AS career,
                COALESCE(COUNT(a.answer), 0) AS count
            FROM
                (
                    SELECT 1 AS career, 'student' AS label
                    UNION ALL SELECT 2, 'staff'
                    UNION ALL SELECT 3, 'business' 
                    UNION ALL SELECT 4, 'other'
                ) g
            LEFT JOIN answers a ON a.answer = g.career
                AND a.question_id = 3
            LEFT JOIN respondents r ON a.respondent_id = r.id
                AND r.survey_id = ?
            GROUP BY
                g.career, g.label
            ORDER BY g.career;`,
            [survey_id]);
        const careerMap = Object.fromEntries(results.map(item => [item.career, item.count]));
        stats.student = careerMap.student ?? 0;
        stats.staff = careerMap.staff ?? 0;
        stats.business = careerMap.business ?? 0;
        stats.otherCareer = careerMap.other ?? 0;

        // count income
        // "<5 triệu", "5-10 triệu", "10-20 triệu", ">20 triệu"
        var [results, _] = await connection.query(`
            SELECT
                g.label AS income,
                COALESCE(COUNT(a.answer), 0) AS count
            FROM
                (
                    SELECT 1 AS income, 'u5mil' AS label
                    UNION ALL SELECT 2, 'f5t10mil'
                    UNION ALL SELECT 3, 'f10t20mil' 
                    UNION ALL SELECT 4, 'over20mil'
                ) g
            LEFT JOIN answers a ON a.answer = g.income
                AND a.question_id = 4
            LEFT JOIN respondents r ON a.respondent_id = r.id
                AND r.survey_id = 1
            GROUP BY
                g.income, g.label
            ORDER BY g.income;`,
            [survey_id]);
        const incomeMap = Object.fromEntries(results.map(item => [item.income, item.count]));
        stats.u5mil = incomeMap.u5mil ?? 0;
        stats.f5t10mil = incomeMap.f5t10mil ?? 0;
        stats.f10t20mil = incomeMap.f10t20mil ?? 0;
        stats.over20mil = incomeMap.over20mil ?? 0;

        // for debug
        console.log(stats);
        return res.status(200).json(stats);
    } catch (error) {
        // for debug
        // console.log(error)
        return res.status(500).json({ message: "Server error." });
    }
}

export const getPlot1Data = async (req, res) => {
    const survey_id = req.params.id1;
    const gender_question = req.params.id2;
    const question_id = req.params.id3;
    try {
        const [results, _] = await connection.query(`
            WITH likert_scale AS (
                SELECT 1 AS likert
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
            ),
            survey_data AS (
                SELECT
                    a1.answer AS likert,
                    a2.answer AS gender
                FROM answers a1
                JOIN answers a2
                    ON a1.respondent_id = a2.respondent_id
                JOIN respondents r
                    ON a1.respondent_id = r.id
                WHERE r.survey_id = ?
                AND a1.question_id = ?
                AND a2.question_id = ?
            ),
            counts AS (
                SELECT
                    likert,
                    SUM(CASE WHEN gender = 1 THEN 1 ELSE 0 END) AS Male,
                    SUM(CASE WHEN gender = 2 THEN 1 ELSE 0 END) AS Female,
                    SUM(CASE WHEN gender = 3 THEN 1 ELSE 0 END) AS Other
                FROM survey_data
                GROUP BY 1
            )
            SELECT
                l.likert AS \`Tần suất mua sắm\`,
                COALESCE(c.Male, 0) AS Nam,
                COALESCE(c.Female, 0) AS Nữ,
                COALESCE(c.Other, 0) AS Khác
            FROM likert_scale l
            LEFT JOIN counts c
                ON l.likert = c.likert
            ORDER BY l.likert;`,
            [survey_id, question_id, gender_question]
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
            WITH likert_scale AS (
                SELECT 1 AS likert
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
            ),
            survey_data AS (
                SELECT
                    a1.answer AS likert,
                    a2.answer AS gender
                FROM answers a1
                JOIN answers a2
                    ON a1.respondent_id = a2.respondent_id
                JOIN respondents r
                    ON a1.respondent_id = r.id
                WHERE r.survey_id = ? 			
                AND a1.question_id = ?		
                AND a2.question_id = ?
            ),
            stats AS (
                SELECT
                    gender,
                    likert,
                    ROUND(
                        COUNT(*) * 100.0 /
                        SUM(COUNT(*)) OVER (PARTITION BY gender),
                        2
                    ) AS percentage
                FROM survey_data
                GROUP BY gender, likert
            ),
            percentages AS (
                SELECT
                    likert,
                    MAX(CASE WHEN gender = 1 THEN percentage ELSE 0 END) AS Male,
                    MAX(CASE WHEN gender = 2 THEN percentage ELSE 0 END) AS Female,
                    MAX(CASE WHEN gender = 3 THEN percentage ELSE 0 END) AS Other
                FROM stats
                GROUP BY 1
            )
            SELECT
                l.likert AS \`Tần suất mua sắm\`,
                COALESCE(p.Male, 0) AS Nam,
                COALESCE(p.Female, 0) AS Nữ,
                COALESCE(p.Other, 0) AS Khác
            FROM likert_scale l
            LEFT JOIN percentages p
                ON l.likert = p.likert
            ORDER BY 1;`,
            [survey_id, question_id, gender_question]
        );

        // for debug
        // console.log(results);

        if (results.length === 0) return res.status(400).json({ message: "Data not found." });

        return res.status(200).json(results);
    } catch (error) {

        return res.status(500).json({ message: "Server error." });
    }
}