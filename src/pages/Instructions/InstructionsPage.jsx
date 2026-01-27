import { useNavigate } from "react-router-dom";
import brain from "../../assets/Insrtruction Image/7718867 copy.svg";
import logo from "../../assets/Insrtruction Image/BG1.svg";
import earth from "../../assets/Insrtruction Image/Group 121090.svg";
import co2 from "../../assets/Insrtruction Image/NTU4MzQ0NDIz [Converted] copy.svg";
import Buttons from "../../components/button";
import "./InstructionsPage.css";

const InstructionsPage = () => {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("/survey");
  }

  return (
    <div className="instruction-container">
      <div
        className="instruction-header"
        style={{ backgroundImage: `url(${logo})` }}
      >
        <div className="instruction-title">
          Know & offset your carbon footprints!
        </div>
      </div>
      <div className="instruction-card">
        <div className="instruction-step">
          <div className="instruction-icon-container brain">
            <img src={brain} alt="" className="instruction-icon" />
          </div>
          <div className="instruction-step-content">
            <p className="instruction-step-title">Answer Our Question</p>
            <p className="instruction-step-description">
              estibulum venenatis fringilla lorem eu finibus. Donec ac nulla nec
              nunc malesuada.
            </p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="instruction-icon-container co2">
            <img src={co2} alt="" className="instruction-icon" />
          </div>
          <div className="instruction-step-content">
            <p className="instruction-step-title">Know your Carbonfootprint</p>
            <p className="instruction-step-description">
              estibulum venenatis fringilla lorem eu finibus. Donec ac nulla nec
              nunc malesuada.
            </p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="instruction-icon-container earth">
            <img src={earth} alt="" className="instruction-icon" />
          </div>
          <div className="instruction-step-content">
            <p className="instruction-step-title">
              Offset it by following the instructions
            </p>
            <p className="instruction-step-description">
              estibulum venenatis fringilla lorem eu finibus. Donec ac nulla nec
              nunc malesuada.
            </p>
          </div>
        </div>

        <div className="instruction-button-container">
          <Buttons
            className="instruction-button instruction-button-later"
            text="Later"
            background="#E6EEFA"
            height="48px"
            margin="40px 0 0 0"
            width="120px"
            fontSize="13px"
            borderRadius="10px"
            border="none"
            color="#0E70EB"
            fontWeight="600"
          />
          <Buttons
            className="instruction-button instruction-button-calculate"
            onClick={handleButtonClick}
            text={"Calculate & offset"}
            background="#1D78EC"
            height="48px"
            margin="40px 0 0 15px"
            width="143px"
            fontSize="13px"
            borderRadius="10px"
            color="#fff"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
