import { useContext, useEffect, useState } from "react";
import "./PromptContainer.css";
import CardContainer from "../cardContainer/CardContainer";
import SliderWithBlocks from "../../../components/circularProgressBarWithLabel/card/slider/Slider";
import { useCookies } from "react-cookie";
import { replace, useNavigate } from "react-router-dom";
import { SurveyDataContext } from "../../../contexts/surveyData/SurveyDataContext";
const PromptContainer = ({
  isLast,
  currStep,
  currSection,
  setIsLast,
  navigateNextQuestion,
  setValidateNext,
}) => {
  const surveyData = useContext(SurveyDataContext)
  const {questions,stepData,cookies,setSurveyData} =  surveyData;
  const [cardData,setCardData] = useState([]);

  useEffect(() => {
    if (currSection > questions[currStep - 1].length) {
      navigateNextQuestion();
    } else if (currStep === questions.length) {
      setIsLast(true);
    } else {
      if (isLast) {
        setIsLast(false);
      }
    }
  }, [currStep, currSection]);
  console.log(currSection,currStep)
  const currentQuestion = questions.length>0?questions[currStep - 1][currSection - 1]?.q:null;
  const currentStepData = stepData.length>0?stepData[currStep - 1][currSection - 1]:null;

  useEffect(()=>{
    if(currentStepData?.type==='card')
  {  if(currentStepData?.name==='fuelTypes'){
      currentStepData?.fetch(cookies?.surveyData[currStep-1]?.selection[0][0])?.then((data)=>{setCardData(data)})
    }
    else{
      currentStepData?.fetch()?.then((data)=>{setCardData(data)})
    }}
  },[currentStepData,currStep,currSection])
  return (
    <div className="promptContainer">
      <div className="question">{currentQuestion}</div>
      {currentStepData?.type === "card" && (
        <CardContainer
          cookies={cookies}
          selectedCardData={cookies.surveyData && cookies?.surveyData?.[currStep-1]?.[currSection-1]}
          select={currentStepData.select}
          setValidateNext={setValidateNext}
          cardData={cardData}
          currSection={currSection}
          currStep={currStep}
        />
      )}
      {currentStepData?.type === "slider" && (
        <div className="slider2">
          <SliderWithBlocks
            className="s1"
            cookies={cookies}
            setValidateNext={setValidateNext}
            start={currentStepData.data.start}
            end={currentStepData.data.end}
            currSection={currSection}
            currStep={currStep}
            selectedSliderData={ cookies.surveyData && cookies?.surveyData[currStep-1][currSection-1]}
            blockInterval={currentStepData.data.blockInterval}
            labelText={currentStepData.data.labelText}
            collectionType={currentStepData.data.collectionType}
          />
        </div>
      )}
    </div>
  );
};

export default PromptContainer;
