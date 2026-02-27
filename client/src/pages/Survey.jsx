import { useState } from 'react'

const Survey = () => {
    const total = 5;
    const [step, setStep] = useState(0);

    const start = () => {
        setStep(1);
    }

    const next = () => {
        setStep(Math.min(step + 1, total));
    }

    const back = () => {
        setStep(Math.max(step - 1, 0));
    }

    const finish = () => {
        setStep(total + 1);
    }

    const reset = () => {
        setStep(0);
    }

    console.log(step)
    return (
        <div className="card card-border bg-base-100 w-full h-200">
            <div className="card-body">
                <h2 className="card-title">BẢNG CÂU HỎI</h2>
                {/* Intro */}
                {step === 0 && <div className='flex-1 space-y-3 mt-6'>
                    <p>Sau đây là các câu hỏi khảo sát về du lịch tại thành phố Nha Trang.</p>
                    <p>Mức độ đánh giá từ "Hoàn toàn KHÔNG đồng ý" đến "Hoàn toàn đồng ý".</p>
                    <p>Sau khi chọn 1 trong các câu trả lời, vui lòng nhấn nút "Kế tiếp" để chuyển sang câu hỏi tiếp theo,
                        Nhấn "Quay lại" để trở về câu hỏi trước đó. Nhấn "Làm lại" để thực hiện lại từ đầu.</p>
                </div>}

                {/* steps */}
                {step >= 1 && step <= total && <ul className="steps steps-vertical lg:steps-horizontal flex-1 mt-6">
                    {Array.from({ length: total }).map((_, index) =>
                        <li key={index} className={`step ${index <= step - 1 ? 'step-primary' : ""}`}></li>
                    )}
                </ul>}

                {/* Finish */}
                {step === total + 1 && <div className='flex-1 flex justify-center items-center'>
                    <h2 className='text-2xl'>Cám ơn quý khách đã tham gia khảo sát!</h2>
                </div>}

                {/* Buttons */}
                <div className="card-actions justify-between">
                    <button className="btn btn-secondary"
                        onClick={reset}
                    >
                        Làm lại</button>
                    <div className="join gap-2">
                        {step > 0 && step <= total && <button className="btn btn-info join-item"
                            onClick={back}
                        >
                            Quay lại
                        </button>}
                        {step > 0 && step < total && <button className="btn btn-primary join-item"
                            onClick={next}
                        >
                            Kế tiếp
                        </button>}
                        {step === 0 && <button className="btn btn-success join-item"
                            onClick={start}
                        >
                            Bắt đầu
                        </button>}
                        {step === total && <button className="btn btn-success join-item"
                            onClick={finish}
                        >
                            Hoàn thành
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Survey