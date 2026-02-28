import { useState, useEffect } from "react";
import axiosInstance from './../axios/instance.js';
import { survey_id } from "./../assets/data.js";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti'

const Survey = () => {
  // const total = questions.length;
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);

  // load current step/answer from local storage
  const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem("eSurvey-step")) || 0;
  });
  const [answers, setAnswers] = useState(() => {
    const ans = localStorage.getItem("eSurvey-ans");
    return ans ? JSON.parse(ans) : {};
  });

  // save answer/current step to local storage for refreshing page
  useEffect(() => {
    const ans = JSON.stringify(answers);
    localStorage.setItem("eSurvey-ans", ans);
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("eSurvey-step", step);
  }, [step]);

  // load questions from database
  useEffect(() => {
    const getQuestions = async () => {
      const response = await axiosInstance.get(`/api/questions/${survey_id}`);
      setQuestions(response.data);
      setTotal(response.data?.length);
    }

    getQuestions();
  }, []);

  // console.log(questions);
  // console.log(total);

  const start = () => {
    setStep(1);
  };

  const next = () => {
    setStep(Math.min(step + 1, total));
  };

  const back = () => {
    setStep(Math.max(step - 1, 0));
  };

  const finish = () => {
    const sendAnswer = async () => {
      try {
        await axiosInstance.post("/api/answers/send-answer", { survey_id, answers });
      } catch (error) {
        console.log(error)
      }
    }
    sendAnswer();
    setStep(total + 1);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    localStorage.removeItem("eSurvey-ans");
    localStorage.removeItem("eSurvey-step");
  };

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [questions[index].id]: value });
  };

  console.log(answers);

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
      {/* <div className="card card-border bg-base-100 w-full h-full mx-2"> */}
      <div className="card-body">
        <h2 className="card-title md:text-2xl">BẢNG CÂU HỎI</h2>
        {/* Intro */}
        {step === 0 && (
          <div className="flex-1 space-y-3 mt-6 lg:text-lg">
            <p>
              Sau đây là các câu hỏi khảo sát về du lịch tại thành phố Nha
              Trang.
            </p>
            <p>
              Mức độ đánh giá từ "Hoàn toàn KHÔNG đồng ý" đến "Hoàn toàn đồng
              ý".
            </p>
            <p>
              Sau khi chọn 1 trong các câu trả lời, vui lòng nhấn nút "Kế tiếp"
              để chuyển sang câu hỏi tiếp theo, Nhấn "Quay lại" để trở về câu
              hỏi trước đó. Nhấn "Làm lại" để thực hiện lại từ đầu.
            </p>
          </div>
        )}

        {/* Questions and answers */}
        {step >= 1 && step <= total && (
          <div className="flex-1 flex flex-row lg:flex-col ml-4 mt-6 lg:mt-4">
            {/* Progress indicator */}
            <ul className="steps steps-vertical lg:steps-horizontal lg:w-full">
              {Array.from({ length: total }).map((_, index) => {
                const isActive = index <= step - 1;
                return (
                  <li
                    key={index}
                    className={`step transition-opacity duration-100 
                        ${isActive ? "step-primary opacity-100" : "opacity-20"}`}
                  />
                );
              })}
            </ul>

            {/* Questions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <div className="ml-10 lg:mt-10">
                  <p className="text-lg">
                    Câu {step}: {questions[step - 1].text}
                  </p>
                  {/* Likert options and Answers */}
                  {questions[step - 1].question_type === "likert" && (
                    <div className="flex flex-col lg:flex-row w-full lg:justify-around gap-4 mx-6 my-6">
                      {questions[step - 1].question_options.options.map((item) => (
                        <label
                          key={item.value}
                          className="flex items-center gap-4 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={questions[step - 1].id}
                            className="radio radio-accent"
                            value={item.value}
                            checked={
                              answers[questions[step - 1].id] == item.value
                            }
                            onChange={(e) =>
                              handleChange(step - 1, e.target.value)
                            }
                          />
                          <span className="text-md">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Demographic options and Answers */}
                  {questions[step - 1].question_type === "select" && (
                    <div className="flex flex-col lg:flex-row w-full justify-around mx-6 my-6">
                      {questions[step - 1].question_options.options.map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={item}
                            className="radio radio-accent"
                            value={index + 1}
                            checked={
                              answers[questions[step - 1].id] == index + 1
                            }
                            onChange={(e) =>
                              handleChange(step - 1, e.target.value)
                            }
                          />
                          <span className="text-md">{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Finish */}
        {step === total + 1 && (
          <div className="flex-1 flex justify-center items-center">
            <h2 className="text-2xl">Cám ơn quý khách đã tham gia khảo sát!</h2>
          </div>
        )}

        {/* Buttons */}
        <div className="card-actions justify-between">
          <button className="btn btn-secondary" onClick={reset}>
            Làm lại
          </button>
          <div className="join gap-2">
            {step > 0 && step <= total && (
              <button className="btn btn-info join-item" onClick={back}>
                Quay lại
              </button>
            )}
            {step > 0 && step < total && (
              <button
                className="btn btn-primary join-item"
                onClick={next}
                disabled={!answers[questions[step - 1]?.id]}
              >
                Kế tiếp
              </button>
            )}
            {step === 0 && (
              <button className="btn btn-success join-item" onClick={start}>
                Bắt đầu
              </button>
            )}
            {step === total && (
              <button
                className="btn btn-success join-item"
                onClick={finish}
                disabled={!answers[questions[step - 1]?.id]}
              >
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </motion.div>
  );
};

export default Survey;
