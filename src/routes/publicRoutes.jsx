import FormPage from "../pages/Form/FormPage";
import InstructionsPage from "../pages/Instructions/InstructionsPage";
import ReportPage from "../pages/KarmaReport/ReportPage";
import SurveyPage from "../pages/Survey/SurveyPage";
import {SurveyDataContextProvider} from '../contexts/surveyData/SurveyDataContext'

const publicRoutes = [
    {
        path:'/instructions',
        element:<InstructionsPage/>
    },
    {
        path:'/survey',
        element:<SurveyDataContextProvider component={<SurveyPage/>} />
        
    },
    {
        path:'/karmaReport',
        element:<SurveyDataContextProvider component={<ReportPage/>} />
    },
    {
        path:'/form',
        element:<SurveyDataContextProvider component={<FormPage/>} />
    }
]

export default publicRoutes;