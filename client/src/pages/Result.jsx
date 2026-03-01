import { motion } from 'framer-motion'
import BarPlot from '../components/BarPlot'
import BarStackPlot from './../components/BarStackPlot';
import axiosInstance from './../axios/instance.js'
import { useEffect, useState } from 'react'
import { survey_id, gender_question, question_id } from './../assets/data.js'

const Result = () => {

    const [stats, setStats] = useState({});
    const [plot1Data, setPlot1Data] = useState([]);
    const [plot2Data, setPlot2Data] = useState([]);

    useEffect(() => {
        const getStats = async () => {
            const response = await axiosInstance.get(`/api/results/stats/${survey_id}`);
            setStats(response.data);
        }
        getStats();
    }, []);

    useEffect(() => {
        const getPlot1Data = async () => {
            const response = await axiosInstance.get(`/api/results/${survey_id}/${gender_question}/${question_id}`);
            setPlot1Data(response.data);
        }
        getPlot1Data();
    }, []);

    useEffect(() => {
        const getPlot2Data = async () => {
            const response = await axiosInstance.get(`/api/results/${survey_id}/${gender_question}/${question_id}/percentage`);
            setPlot2Data(response.data);
        }
        getPlot2Data();
    }, []);

    console.log(plot1Data);
    console.log(plot2Data);
    console.log(stats);

    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: "easeOut",
            }}
            className="card card-border bg-base-100 w-full h-full mx-2"
        >
            <h2 className="card-title md:text-xl m-3">KẾT QUẢ KHẢO SÁT</h2>
            <h2 className="text m-3 ml-5">Số người tham gia khảo sát: {stats.survey_size}</h2>
            <div className="card-body w-[50vw] mx-auto flex flex-col items-center">
                <BarPlot
                    data={plot1Data}
                    xKeys={["Tần suất mua sắm"]}
                    yKeys={["Nam", "Nữ", "Khác"]}
                    title="Tần suất mua sắm theo giới tính"
                />
                <BarStackPlot
                    data={plot2Data}
                    xKeys={["Tần suất mua sắm"]}
                    yKeys={["Nam", "Nữ", "Khác"]}
                    title="Tần suất mua sắm theo giới tính (%)"
                />
            </div>
        </motion.div>
    )
}

export default Result