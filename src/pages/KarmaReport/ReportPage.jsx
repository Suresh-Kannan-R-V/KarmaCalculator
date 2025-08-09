import "./ReportPage.css";
import bdImg from "../../assets/Mask Group 112.svg";
import "../../assets/Fonts/css/excon.css";
import SVGComponent from "../../assets/SVGComponent";
import Status from "../../assets/icons8-graph-report (2).svg";
import SVGComponent2 from "../../assets/SVGComponent2";
import tree from "../../assets/Deciduous Tree.png";
import GaugeChart from "./graph";
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { Link } from "react-router-dom";
import Buttons from "../../components/button";
import { useContext, useEffect, useState } from "react";
import { SurveyDataContext } from "../../contexts/surveyData/SurveyDataContext";
import positiveBg from "../../assets/positiveReportBG.png";
const ReportPage = () => {
	const {score} =  useContext(SurveyDataContext);
	const [percentage,setPercentage]  = useState(0);
	useEffect(()=>{
         setPercentage((((score/14.4))*100).toFixed(2)-100)
	},[score])
	return (
		<div className="parent" style={{ backgroundImage: `url(${percentage>0?bdImg:positiveBg})` }}>
			<div className="head">
				<h3 style={{ color: "#000" }}>Summary</h3>
			</div>
			<div className="body">
				<div className="Report">
					<SVGComponent className="svg" />
					<div className="container">
						<div className="conTitle">
							<h5 style={{ color: "#000" }}>Your annual carbon footprint</h5>
						</div>
						<div className="Graph" style={{ color: "#000" }}>
							<GaugeChart values={[60, 20, 30]} />
						
						</div>
						<div className="GraphReport">
							<div className={percentage<1?"positiveRepContainer":"negativeRepContainer"}>
								<div className="RepImg">
									<TimelineOutlinedIcon />
								</div>
								<div className=
								"RepFeed">
									{percentage>0?<p>Which is {percentage.toFixed(2)}% higher than average</p>:
									percentage<0?<p>Which is {(percentage*(-1)).toFixed(2)}% lower than average</p>:
									<p>Which is average</p>
										
									}
									
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="PlantTree">
					<SVGComponent2 className="svg" />
					<div className="container">
						<div className="tree">
							<img src={tree}></img>
						</div>
						{percentage>0?<div className="Tag">
							<h6 style={{ color: "#000" }}>
								Offset your excess Carbon footprint by
							</h6>
							<h4>Planting {((percentage/100)*60).toFixed(0)} Saplings</h4>
						</div>:<div className="Tag">
							<h6 style={{ color: "#000" }}>
								You are on a good track
							</h6>
							<h4>Plant trees to help more</h4>
						</div>}
						<div className="Submit">
							<Link to="/form">
								<Buttons
									text={percentage>0?"Plant now to offset":"Plant more trees"}
									background="#1b9863"
									color="#fff"
									fontSize="12px"
								/>
							</Link>
						</div>
					</div>
				</div>
				<div className="Remaind">
					<Link to="/instructions">
						<button style={{ color: "#0E70EB" }}>Remind Me Later</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ReportPage;
