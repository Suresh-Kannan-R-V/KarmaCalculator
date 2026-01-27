/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import axios from "axios";
import CryptoJS from "crypto-js";
import { useContext, useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import Buttons from "../../components/button";
import { apiHost } from "../../config/config";
import { SurveyDataContext } from "../../contexts/surveyData/SurveyDataContext";
import "./SurveyPage.css";
import PromptContainer from "./promptContainer/PromptContainer";
import surveypage1 from "/src/assets/SurveyPage1.png";
import surveypage2 from "/src/assets/SurveyPage2.png";
import surveypage3 from "/src/assets/surveypage3.png";
import surveypage4 from "/src/assets/surveypage4.png";
import surveypage5 from "/src/assets/surveypage5.png";
import surveypage6 from "/src/assets/surveypage6.png";
const SurveyPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currSection, setCurrSection] = useState(1);
  const { cookies, setLastSurveyPosition, score, surveyPostData } =
    useContext(SurveyDataContext);
  const [currStep, setCurrStep] = useState(1);
  const [validateNext, setValidateNext] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const totalSteps = 4;
  useEffect(() => {
    if (cookies.lastSurveyPosition) {
      console.log(
        searchParams?.get("step")
          ? Number(
            CryptoJS.AES.decrypt(
              searchParams?.get("section"),
              "Karma007"
            ).toString(CryptoJS.enc.Utf8)
          )
          : ""
      );
      try {
        const nextStep = searchParams?.get("step")
          ? Number(
            CryptoJS.AES.decrypt(
              searchParams?.get("step"),
              "Karma007"
            ).toString(CryptoJS.enc.Utf8)
          )
          : 1;
        if (nextStep > cookies.lastSurveyPosition.step) {
          setCurrStep(cookies.lastSurveyPosition.step);
        } else {
          setCurrStep(nextStep === 0 ? 1 : nextStep);
        }

        const nextSection = searchParams?.get("section")
          ? Number(
            CryptoJS.AES.decrypt(
              searchParams?.get("section"),
              "Karma007"
            ).toString(CryptoJS.enc.Utf8)
          )
          : 1;
        if (nextStep > cookies.lastSurveyPosition.step) {
          setCurrSection(cookies.lastSurveyPosition.section);
        } else {
          setCurrSection(nextSection === 0 ? 1 : nextSection);
        }
      } catch (error) {
        console.log(error);
        setCurrStep(1);
        setCurrSection(1);
      }
    }
  }, [searchParams, cookies.lastSurveyPosition]);

  const encryptData = (data) => {
    console.log(CryptoJS.AES.encrypt(data, "Karma007").toString());
    return CryptoJS.AES.encrypt(data, "Karma007").toString();
  };

  const [backgroundImages, setBackgroundImages] = useState([
    {
      score: 0,
      img_url: surveypage1,
    },
    {
      score: 10,
      img_url: surveypage2,
    },
    {
      score: 15,
      img_url: surveypage3,
    },
    {
      score: 17,
      img_url: surveypage4,
    },
    {
      score: 17.5,
      img_url: surveypage5,
    },
    {
      score: 17.6,
      img_url: surveypage6,
    },
  ]);

  const navigateNextQuestion = () => {
    if (validateNext) {
      setLastSurveyPosition({ step: currStep + 1, section: 1 });
      setSearchParams(
        { step: encryptData(`${currStep + 1}`), section: encryptData(`1`) },
        { replace: true }
      );
    }
  };

  useEffect(() => {
    if (cookies.lastSurveyPosition) {
      if (cookies.lastSurveyPosition.step < currStep) {
        setCurrStep(cookies.lastSurveyPosition.step);
      }
      if (cookies.lastSurveyPosition.section < currStep) {
        setCurrSection(cookies.lastSurveyPosition.section);
      }
    }
  }, [cookies.lastSurveyPosition]);

  useEffect(() => {
    if (!validateNext && (currStep > 1 || currSection > 1)) {
      setLastSurveyPosition({ step: currStep, section: currSection });
    }
  }, [validateNext]);

  const handleNext = () => {
    if (validateNext) {
      setLastSurveyPosition({ step: currStep, section: currSection + 1 });
      setSearchParams({
        step: encryptData(`${currStep}`),
        section: encryptData(`${currSection + 1}`),
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div
      style={{
        backgroundImage: `url( ${backgroundImages?.find((data, i) => {
          if (i < backgroundImages.length - 1) {
            return (
              score >= data.score && score <= backgroundImages[i + 1].score
            );
          } else {
            return true;
          }
        }).img_url
          })`,
      }}
      className="container"
    >
      <div className="inner-container ">
        <div className="scoreContainer">
          <div className="score">
            <div className="arrowUp">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M12.2048 7.29258L18.1189 15.7412C18.49 16.2715 18.1107 17 17.4635 17L6.53652 17C5.88931 17 5.50998 16.2715 5.88114 15.7412L11.7952 7.29258C11.8947 7.1504 12.1053 7.1504 12.2048 7.29258Z"
                    fill="#ff0000"
                  ></path>{" "}
                </g>
              </svg>
            </div>
            {score.toFixed(2)} ton CO2
          </div>
        </div>
      </div>
      <div className="questionContainer">
        <div className="progressBarContainer">
          <div className="progressBar">
            <CircularProgressbarWithChildren
              maxValue={totalSteps}
              value={Math.floor(currStep)}
              styles={buildStyles({
                pathTransitionDuration: 0.5,
                strokeWidth: 10,
                rotation: 0,
                trailColor: "#FFF4E4",
                pathColor: "#FEA062",
              })}
            >
              <div className="stepDisplay">{`${Math.floor(
                currStep
              )}/${totalSteps}`}</div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <div className="stepPageContainer">
          <PromptContainer
            setCurrStep={setCurrStep}
            setCurrSection={setCurrSection}
            isLast={isLast}
            setValidateNext={setValidateNext}
            setIsLast={setIsLast}
            navigateNextQuestion={navigateNextQuestion}
            currStep={currStep}
            currSection={currSection}
          />
        </div>
      </div>
      <div className="buttonsContainer">
        {!isLast &&
          (currStep !== 1 || currSection !== 1) &&
          currStep < totalSteps + 1 && (
            <Buttons
              type="light"
              onClick={handleBack}
              text={"Back"}
              width="100%"
              background="#E6EEFA"
              color="#0E70EB"
              borderRadius="10px"
              border="none"
            />
          )}
        {!isLast && currStep < totalSteps + 1 && (
          <Buttons
            onClick={handleNext}
            text={"Next"}
            width="100%"
            background="#1D78EC"
            color="#fff"
            borderRadius="10px"
          />
        )}

        {isLast && (
          <Buttons
            onClick={() => {
              console.log(surveyPostData)
              axios
                .post(`${apiHost}/api/carbonsurvey`, surveyPostData)
                .then((response) => {
                  if (response.status === 201) {
                    navigate("/karmareport");
                  }
                }).catch((e) => console.log(e));
            }}
            text={"Calculate Carbon Footprint"}
            width="100%"
            background="#1D78EC"
            color="#fff"
            borderRadius="10px"
          />
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
