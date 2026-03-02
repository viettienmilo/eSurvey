-- count shopping frequency by gender
WITH likert_scale AS (
    SELECT
        1 AS likert
    UNION
    ALL
    SELECT
        2
    UNION
    ALL
    SELECT
        3
    UNION
    ALL
    SELECT
        4
    UNION
    ALL
    SELECT
        5
),
survey_data AS (
    SELECT
        a1.answer AS likert,
        a2.answer AS gender
    FROM
        answers a1
        JOIN answers a2 ON a1.respondent_id = a2.respondent_id
        JOIN respondents r ON a1.respondent_id = r.id
    WHERE
        r.survey_id = 1
        AND a1.question_id = 5
        AND a2.question_id = 3
),
counts AS (
    SELECT
        likert,
        SUM(
            CASE
                WHEN gender = 1 THEN 1
                ELSE 0
            END
        ) AS Male,
        SUM(
            CASE
                WHEN gender = 2 THEN 1
                ELSE 0
            END
        ) AS Female,
        SUM(
            CASE
                WHEN gender = 3 THEN 1
                ELSE 0
            END
        ) AS Other
    FROM
        survey_data
    GROUP BY
        likert
)
SELECT
    l.likert,
    COALESCE(c.Male, 0) AS Male,
    COALESCE(c.Female, 0) AS Female,
    COALESCE(c.Other, 0) AS Other
FROM
    likert_scale l
    LEFT JOIN counts c ON l.likert = c.likert
ORDER BY
    l.likert;

-- percentage version
WITH likert_scale AS (
    SELECT
        1 AS likert
    UNION
    ALL
    SELECT
        2
    UNION
    ALL
    SELECT
        3
    UNION
    ALL
    SELECT
        4
),
survey_data AS (
    SELECT
        a1.answer AS likert,
        a2.answer AS gender
    FROM
        answers a1
        JOIN answers a2 ON a1.respondent_id = a2.respondent_id
        JOIN respondents r ON a1.respondent_id = r.id
    WHERE
        r.survey_id = 1
        AND a1.question_id = 5
        AND a2.question_id = 1
),
stats AS (
    SELECT
        gender,
        likert,
        ROUND(
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY gender),
            2
        ) AS percentage
    FROM
        survey_data
    GROUP BY
        gender,
        likert
),
percentages AS (
    SELECT
        likert,
        MAX(
            CASE
                WHEN gender = 1 THEN percentage
                ELSE 0
            END
        ) AS Male,
        MAX(
            CASE
                WHEN gender = 2 THEN percentage
                ELSE 0
            END
        ) AS Female,
        MAX(
            CASE
                WHEN gender = 3 THEN percentage
                ELSE 0
            END
        ) AS Other
    FROM
        stats
    GROUP BY
        1
)
SELECT
    l.likert AS `Tần suất mua sắm`,
    COALESCE(p.Male, 0) AS Nam,
    COALESCE(p.Female, 0) AS Nữ,
    COALESCE(p.Other, 0) AS Khác
FROM
    likert_scale l
    LEFT JOIN percentages p ON l.likert = p.likert
ORDER BY
    1;