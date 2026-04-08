import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { apiHost } from "../../config/config";
export const SurveyDataContext = createContext(null);

export const SurveyDataContextProvider = ({ component }) => {
  const [score, setScore] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(['surveyData', 'lastSurveyPosition']);
  const [surveyPostData, setSurveyPostData] = useState({
    user_id: 1,
    vehicle_id: null,
    vehicles_count: 0,
    distance_per_week: 0,
    food_id: null,
    electricity_units: 0,
    carbon_footprint: 0
  });
  const setSurveyData = (data) => {
    setCookie('surveyData', data);
  }
  const setLastSurveyPosition = (data) => {
    setCookie('lastSurveyPosition', data);
  }

  const clearSurveyStorage = () => {
    removeCookie('surveyData', { path: '/' });
    removeCookie('lastSurveyPosition', { path: '/' });
    localStorage.removeItem('surveyData');
    localStorage.removeItem('lastSurveyPosition');
    setScore(0);
    setSurveyPostData({
      user_id: 1,
      vehicle_id: null,
      vehicles_count: 0,
      distance_per_week: 0,
      food_id: null,
      electricity_units: 0,
      carbon_footprint: 0
    });
  }

  const fetchVehicleTypes = async () => {
    let responseData = null
    try {
      await axios.get(`${apiHost}/api/vehicleTypes`).then((res) => {
        responseData = res.data;
      })
    } catch (error) {
      console.error(error.message || "Error in fetching Vehicle Types")

      return (null);
    }
    return responseData
  }

  const fetchFoodTypes = async () => {
    let responseData = null
    try {
      await axios.get(`${apiHost}/api/foodTypes`).then((res) => {
        responseData = res.data;
      })
    } catch (error) {
      console.error(error.message || "Error in fetching Food Types")

      return (null);
    }
    return responseData
  }

  const fetchAppliancesTypes = async () => {
    let responseData = null
    try {
      await axios.get(`${apiHost}/api/appliancesTypes`).then((res) => {
        responseData = res.data;
      })
    } catch (error) {
      console.error(error.message || "Error in fetching Appliances Types")

      return (null);
    }
    return responseData
  }


  const fetchFuelTypes = async (vehicleId) => {
    let responseData = null
    if (!vehicleId) {
      console.error("Invalid Vehicle Type")
      return (null);
    }
    try {
      await axios.get(`${apiHost}/api/fueltypes/${vehicleId}`).then((res) => {
        responseData = res.data;
      })
    } catch (error) {
      console.error(error.message || "Error in fetching Fuel Types")

      return (null);
    }
    return responseData
  }

  const [questions, setQuestions] = useState([
    [
      { q: "Choose the vehicles you use for commuting?" },
      { q: "How many Vehicles do you own?" },
      { q: "What type of fuel do you use?" },
      { q: "How many KM do you drive per week?" },
    ],
    [{ q: "What you normally eat?" }],
    [
      {
        q: "Select the appliances you use at your home",
      },
    ],
    [
      {
        q: "How much electricity do you consume for a month?",
      },
    ],
  ]);

  const [stepData, setStepData] = useState([
    [
      {
        type: 'card',
        name: 'vehicleTypes',
        select: 'single',
        fetch: fetchVehicleTypes,
      },
      {
        type: 'slider',
        name: 'noOfVehicles',
        data: {
          "blockInterval": 2,
          "start": 2,
          "end": 10,
          "labelText": "",
          "collectionType": "vehicles"
        }
      },
      {
        type: 'card',
        name: 'fuelTypes',
        select: 'single',
        fetch: fetchFuelTypes,
      },
      {
        type: 'slider',
        data: {
          "start": 10,
          "end": 250,
          "labelText": "km",
          "collectionType": "km"
        }
      },
    ],
    [
      {
        type: 'card',
        name: 'fuelTypes',
        select: 'single',
        fetch: fetchFoodTypes,
      },
    ],
    [
      {
        type: 'card',
        name: 'fuelTypes',
        select: 'multi',
        fetch: fetchAppliancesTypes,
      },
    ],
    [
      {
        "type": "slider",
        "name": "power_units",
        "data": {
          "start": 100,
          "end": 1000,
          "labelText": "units",
          "collectionType": "units"
        }
      }
    ]
  ]);



  useEffect(() => {
    if (cookies.surveyData) {
      let totalEmission = 0;
      totalEmission += cookies.surveyData[0].selection[3] * cookies.surveyData[0].emission;
      totalEmission += cookies.surveyData[1].emission;
      let appliancesCount = cookies.surveyData[2].selection.length;
      totalEmission += cookies.surveyData[2].emission * (cookies.surveyData[3].selection[0] / appliancesCount) / 100;

      const vehicleId = cookies.surveyData[0].selection[0][0];
      const vehiclesCount = cookies.surveyData[0].selection[1];
      const vehiclesFuelId = cookies.surveyData[0].selection[2][0];
      const distancePerWeek = cookies.surveyData[0].selection[3];
      const foodId = cookies.surveyData[1].selection[0][0];
      const appliances = cookies.surveyData[2].selection[0];
      const electricityUnits = cookies.surveyData[3].selection[0];
      setSurveyPostData({
        user_id: 1,
        vehicle_id: vehicleId,
        vehicles_count: vehiclesCount,
        vehicle_fuel_id: vehiclesFuelId,
        distance_per_week: distancePerWeek,
        food_id: foodId,
        electricity_units: electricityUnits,
        carbon_footprint: totalEmission,
        appliances: appliances
      })
      setScore(totalEmission)

    }
    else {
      const stepArray = Array(stepData.length);
      let index = 0;
      stepData.forEach((step) => {
        stepArray[index++] = {
          selection: Array(step.length).fill(Array()),
          emission: 0.00
        }
      })
      setCookie('surveyData', stepArray);
    }

  }, [stepData, cookies.surveyData])

  //  console.log(cookies.surveyData)

  return (
    <SurveyDataContext.Provider
      value={{
        cookies,
        setSurveyData,
        stepData,
        questions,
        score,
        setScore,
        surveyPostData,
        setLastSurveyPosition,
        clearSurveyStorage
      }}
    >
      {component}
    </SurveyDataContext.Provider>
  );
};


