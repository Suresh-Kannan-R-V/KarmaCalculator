import { useContext, useEffect, useState } from "react";
import "./Slider.css";
import Slider from "@mui/material/Slider";
import { SurveyDataContext } from "../../../../contexts/surveyData/SurveyDataContext";

const SliderWithBlocks = ({
  blockInterval,
  start,
  end,
  labelText,
  collectionType,
  currStep,
  currSection,
  selectedSliderData,
  setValidateNext,
}) => {
  const [formattedValues, setFormattedValues] = useState([]);
  const { cookies, setSurveyData, score, setScore } = useContext(SurveyDataContext);
  const [value, setValue] = useState(start);

  useEffect(() => {
    setValidateNext(true);
  }, [setValidateNext]);

  useEffect(() => {
    if (!Number.isNaN(cookies.surveyData[currStep - 1].selection[currSection - 1]) && cookies.surveyData[currStep - 1].selection[currSection - 1] !== 0) {
      setValue(cookies.surveyData[currStep - 1].selection[currSection - 1])
    }
  }, [cookies.surveyData])

  useEffect(() => {
    const totalSteps = blockInterval ? (end - start) / blockInterval + 1 : 2;
    const newArray = Array.from({ length: totalSteps }, (_, i) => {
      const value = blockInterval
        ? start + i * blockInterval
        : start + i * (end - start);
      return {
        value,
        label: `${value} ${labelText ? labelText : ""}`,
      };
    });

    setFormattedValues(newArray); // Set the new array with formatted values
  }, [blockInterval, start, end, labelText]);

  return (
    <div className="sliderContainer">
      <div className="slider">
        <Slider
          sx={{
            width: "100%",
            "& .MuiSlider-thumb": {
              height: 25,
              width: 4,
              borderRadius: 2,
              backgroundColor: "#0e70eb",
            },
            '& .MuiSlider-thumb[data-index="1"]': {
              height: 15,
              width: 15,
              zIndex: 1,
              borderRadius: "100%",
              backgroundColor: "#0e70eb",
            },
            "& .MuiSlider-track": {
              height: 5,
              borderRadius: 4,
              border: "none",
              background: `linear-gradient(
                to right,
                #0e70eb ${((value - start) / (end - start)) * 100}%, /* Blue until this point */
                gray ${((value - start) / (end - start)) * 100}%
              )`
              ,
            },
            "& .MuiSlider-rail": {
              opacity: 0.5,
              backgroundColor: "#bfbfbf",
            },
            "& .MuiSlider-markLabel": {
              fontWeight: "1000",
              fontSize: "13px",
              textAlign: "center",
              whiteSpace: "nowrap", // Ensure labels are in one line
              transform: "translateX(-50%)", // Center the labels
            },
            // Adjustments for first and last marks to prevent overflow
            "& .MuiSlider-markLabel[data-index='0']": {
              transform: "translateX(0%)", // Prevent left overflow
            },
            [`& .MuiSlider-markLabel[data-index='${formattedValues.length - 1}']`]: {
              transform: "translateX(-100%)", // Prevent right overflow
            },
          }}
          value={[start, value, end]}
          onChange={(e, newValue) => {
            setValue(newValue[1]); // Update all three values
            cookies.surveyData[currStep - 1].selection[currSection - 1] = newValue[1];
            setSurveyData(cookies.surveyData);
          }}
          marks={formattedValues}
          valueLabelDisplay="auto"
          min={start}
          max={end}
        />
      </div>
      <div className="valueButtonContainer">
        <div className="valueButton">
          {value + ` ${collectionType ? collectionType : ""}`}
        </div>
      </div>
    </div>
  );
};

export default SliderWithBlocks;
