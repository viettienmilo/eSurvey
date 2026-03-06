import { motion } from "framer-motion";
import BarPlot from "../components/BarPlot";
import axiosInstance from "./../axios/instance.js";
import { useEffect, useState } from "react";
import { survey_id, gender_question, question_id } from "./../assets/data.js";

const Result = () => {
  const [stats, setStats] = useState(null);
  const [plot1Data, setPlot1Data] = useState([]);
  const [plot2Data, setPlot2Data] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      const response = await axiosInstance.get(
        `/api/results/stats/${survey_id}`,
      );
      setStats(response.data);
    };
    getStats();
  }, []);

  useEffect(() => {
    const getPlot1Data = async () => {
      const response = await axiosInstance.get(
        `/api/results/${survey_id}/${gender_question}/${question_id}`,
      );
      setPlot1Data(response.data);
    };
    getPlot1Data();
  }, []);

  useEffect(() => {
    const getPlot2Data = async () => {
      const response = await axiosInstance.get(
        `/api/results/${survey_id}/${gender_question}/${question_id}/percentage`,
      );
      setPlot2Data(response.data);
    };
    getPlot2Data();
  }, []);

  const genders = [
    { title: "Nam", value: stats?.male },
    { title: "Nữ", value: stats?.female },
    { title: "Khác", value: stats?.otherGender },
  ];

  const ages = [
    { title: "<18", value: stats?.u18 },
    { title: "18-24", value: stats?.f18t24 },
    { title: "25-34", value: stats?.f25t34 },
    { title: "35-44", value: stats?.f35t44 },
    { title: "45+", value: stats?.over45 },
  ];

  const careers = [
    { title: "SV/HS", value: stats?.student },
    { title: "Nhân viên", value: stats?.staff },
    { title: "Kinh doanh", value: stats?.business },
    { title: "Khác", value: stats?.otherCareer },
  ];

  const income = [
    { title: "<5tr", value: stats?.u5mil },
    { title: "5-10tr", value: stats?.f5t10mil },
    { title: "10-20tr", value: stats?.f10t20mil },
    { title: ">20tr", value: stats?.over20mil },
  ];

  const shoppingFreq = {
    1: "Hàng ngày",
    2: "Hàng tuần",
    3: "Hàng tháng",
    4: "Hiếm khi",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="card card-border bg-base-100 flex grow w-full mx-2"
    >
      <h2 className="card-title md:text-xl mx-3 my-2">KẾT QUẢ KHẢO SÁT</h2>
      <div className="card-body flex flex-col md:flex-row w-full h-full">
        <div className="w-2/5">
          <h2 className="text-lg m-3 ml-5">
            Tên khảo sát: <i className="text-blue-400">{stats?.survey_title}</i>
          </h2>
          <h2 className="text-lg m-3 ml-5">
            Số lượng câu hỏi:{" "}
            <i className="text-blue-400">{stats?.question_size}</i>
          </h2>
          <h2 className="text-lg m-3 ml-5">
            Số người tham gia khảo sát:{" "}
            <i className="text-blue-400">{stats?.respondents}</i>
          </h2>
          <h2 className="text-lg m-3 ml-5">
            Giới tính người tham gia khảo sát:
          </h2>
          <div className="ml-3">
            {genders.map((item) => (
              <span className="text-lg m-3 ml-5">
                {item.title} : <i className="text-blue-400">{item.value}</i>
              </span>
            ))}
          </div>
          <h2 className="text-lg m-3 ml-5">Độ tuổi người tham gia khảo sát:</h2>
          <div className="ml-3">
            {ages.map((item) => (
              <span className="text-lg m-3 ml-5">
                {item.title} : <i className="text-blue-400">{item.value}</i>
              </span>
            ))}
          </div>
          <h2 className="text-lg m-3 ml-5">
            Nghề nghiệp người tham gia khảo sát:
          </h2>
          <div className="ml-3">
            {careers.map((item) => (
              <span className="text-lg m-3 ml-5">
                {item.title} : <i className="text-blue-400">{item.value}</i>
              </span>
            ))}
          </div>
          <h2 className="text-lg m-3 ml-5">
            Thu nhập người tham gia khảo sát:
          </h2>
          <div className="ml-3">
            {income.map((item) => (
              <span className="text-lg m-3 ml-5">
                {item.title} : <i className="text-blue-400">{item.value}</i>
              </span>
            ))}
          </div>
        </div>
        <div className="w-3/5 mx-auto flex flex-col items-center">
          <BarPlot
            data={plot1Data}
            xKeys={["Tần suất mua sắm"]}
            yKeys={["Nam", "Nữ", "Khác"]}
            xLabels={shoppingFreq}
            title="Tần suất mua sắm theo giới tính"
          />
          <BarPlot
            data={plot2Data}
            xKeys={["Tần suất mua sắm"]}
            yKeys={["Nam", "Nữ", "Khác"]}
            xLabels={shoppingFreq}
            title="Tần suất mua sắm theo giới tính (%)"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Result;
