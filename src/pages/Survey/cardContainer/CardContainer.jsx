import React, { useContext, useEffect, useState } from "react";
import Card from "../../../components/circularProgressBarWithLabel/card/Card";
import "./CardContainer.css";
import { SurveyDataContext } from "../../../contexts/surveyData/SurveyDataContext";

const CardContainer = ({
  cardData,
  select,
  setValidateNext,
  selectedCardData,
  currStep,
  currSection,
}) => {
  const { cookies, setSurveyData } = useContext(SurveyDataContext);
  const handleBorder = (index) => {
    console.log(currSection);
    console.log(cookies.surveyData[currStep - 1]);
    let emission = 0;
    if (
      !cookies.surveyData[currStep - 1]?.selection[currSection - 1]?.includes(
        cardData[index].id
      )
    ) {
      if (select === "single") {
        cookies.surveyData[currStep - 1].selection[currSection - 1] = [
          cardData[index].id,
        ];
      } else {
        cookies.surveyData[currStep - 1].selection[currSection - 1].push(
          cardData[index].id
        );
      }
      setSurveyData(cookies.surveyData);
    } else {
      if (select === "single") {
        cookies.surveyData[currStep - 1].selection[currSection - 1] = [];
      } else {
        const removeIndex = cookies.surveyData[currStep - 1].selection[
          currSection - 1
        ].findIndex((data) => data === cardData[index].id);
        if (removeIndex !== null) {
          cookies.surveyData[currStep - 1].selection[currSection - 1].splice(
            removeIndex,
            1
          );
        }
      }
      setSurveyData(cookies.surveyData);
    }

    if (cookies?.surveyData?.[currStep - 1]?.selection[currSection - 1]) {
      if(currStep===1){  cookies.surveyData[currStep - 1].emission =
       Number(cardData.find((data) =>
        cookies?.surveyData[currStep - 1]?.selection[currSection - 1]?.includes(
          data.id
        )
      )?.vehicle_emmisions?.[0]?.emission_value);}
      else{
        cookies?.surveyData?.[currStep - 1]?.selection[currSection - 1].forEach((id)=>{
          cookies.surveyData[currStep - 1].emission+= Number(cardData.find((data) =>
            cookies?.surveyData[currStep - 1]?.selection[currSection - 1]?.includes(
              id
            )
          )?.emission_value)
        })
      }
    }
    setSurveyData(cookies.surveyData);

    if (
      cookies.surveyData[currStep - 1].selection[currSection - 1].length > 0
    ) {
      setValidateNext(true);
    } else {
      setValidateNext(false);
    }
  };
  useEffect(() => {
    setValidateNext(false);
    if (
      cookies?.surveyData[currStep - 1]?.selection[currSection - 1]?.length > 0
    ) {
      setValidateNext(true);
    }
  }, []);

  return (
    <div className="cardsContainer">
      {cardData?.length > 0 &&
        cardData?.map((data, index) => (
          <div
            style={{
              flex: `0 1 ${cardData.length > 6 ? "25%" : "35%"}`,
            }}
            className="card"
            onClick={() => {
              handleBorder(index);
            }}
            key={index}
          >
            <Card
              content={data.title}
              title={data.name}
              borderColor={
                cookies?.surveyData[currStep - 1]?.selection[
                  currSection - 1
                ]?.includes(data.id)
                  ? data.border_color
                  : ""
              }
              backgroundColor={data.color}
            />
          </div>
        ))}
    </div>
  );
};

export default CardContainer;
