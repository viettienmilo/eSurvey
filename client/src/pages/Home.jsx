import { useEffect, useState } from 'react';
import axiosInstance from './../axios/instance.js';
import { survey_id } from './../assets/data.js';
import Hero from './../components/Hero.jsx';

const Home = () => {

    const [survey, setSurvey] = useState({});

    const getSurvey = async () => {
        const response = await axiosInstance.get(`/api/surveys/${survey_id}`);
        setSurvey(response.data[0]);
    }

    useEffect(() => {
        getSurvey();
    }, []);


    return (
        <div>
            {survey && <Hero survey={survey} />}
        </div>
    )
}

export default Home