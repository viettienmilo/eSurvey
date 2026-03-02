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
      console.log(response);
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

  // console.log(plot1Data);
  // console.log(plot2Data);
  //   console.log(stats);

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
      className="card card-border bg-base-100 w-full h-full mx-2"
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
          <h2 className="text-lg m-3 ml-5">Giới tính người tham gia khảo sát:</h2>
          <div className="ml-3">
            <span className="text-lg m-3 ml-5">
              Nam: <i className="text-blue-400">{stats?.male}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Nữ: <i className="text-blue-400">{stats?.female}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Khác: <i className="text-blue-400">{stats?.otherGender}</i>
            </span>
          </div>
          <h2 className="text-lg m-3 ml-5">Độ tuổi người tham gia khảo sát:</h2>
          <div className="ml-3">
            <span className="text-lg m-3 ml-5">
              Dưới 18t: <i className="text-blue-400">{stats?.u18}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              18-24t: <i className="text-blue-400">{stats?.f18t24}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              25-34t: <i className="text-blue-400">{stats?.f25t34}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              35-44t: <i className="text-blue-400">{stats?.f35t44}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              45t+: <i className="text-blue-400">{stats?.over45}</i>
            </span>
          </div>
          <h2 className="text-lg m-3 ml-5">Nghề nghiệp người tham gia khảo sát:</h2>
          <div className="ml-3">
            <span className="text-lg m-3 ml-5">
              Sinh viên/HS: <i className="text-blue-400">{stats?.student}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Nhân viên: <i className="text-blue-400">{stats?.staff}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Kinh doanh: <i className="text-blue-400">{stats?.business}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Khác: <i className="text-blue-400">{stats?.otherCareer}</i>
            </span>
          </div>
          <h2 className="text-lg m-3 ml-5">Thu nhập người tham gia khảo sát:</h2>
          <div className="ml-3">
            <span className="text-lg m-3 ml-5">
              Dưới 5 triệu: <i className="text-blue-400">{stats?.u5mil}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              5 - 10 triệu: <i className="text-blue-400">{stats?.f5t10mil}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              10 - 20 triệu: <i className="text-blue-400">{stats?.f10t20mil}</i>
            </span>
            <span className="text-lg m-3 ml-5">
              Trên 20 triệu: <i className="text-blue-400">{stats?.over20mil}</i>
            </span>
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
