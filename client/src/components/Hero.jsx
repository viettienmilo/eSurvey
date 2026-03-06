import HeroImg from "./../assets/esurvey-hero.png";
import { Link } from "react-router";

const Hero = ({ survey }) => {
  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={HeroImg} className="max-w-xl rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold">
            Tham gia khảo sát cùng chúng tôi!
          </h1>
          <p className="pt-6">
            Để phục vụ quý khách hàng tốt hơn trong quá trình trải nghiệm dịch
            vụ, chúng tôi tiến hành thực hiện
            <span className="text-emerald-400"> {survey?.title}.</span>
          </p>
          <p className="pt-2 pb-6">
            Quý khách vui lòng nhấn nút "Bắt đầu" để tiến hành khảo sát. Xin
            chân thành cám ơn Quý khách hàng.
          </p>
          <Link
            type="button"
            to="/started"
            className="btn btn-soft btn-accent w-auto"
            onClick={() => {
              localStorage.removeItem("eSurvey-ans");
              localStorage.removeItem("eSurvey-step");
            }}
          >
            Bắt đầu
          </Link>
          {/* <Link to='/started'>Start</Link> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
