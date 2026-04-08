import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes/Routes'
import { SurveyDataContextProvider } from './contexts/surveyData/SurveyDataContext'

function App() {
  return (
     <Router>
       <SurveyDataContextProvider component={<Routes/>}/>
     </Router>
  )
}

export default App;
