import React from 'react';
import './App.css';
import {fetchData, getAvailableCities} from "../../store/actions/weather";
import {connect} from 'react-redux'
import Loader from "../Loader/Loader";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import defaultBg from './bliss_1.webp'
import Search from "../Search/Search";

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: {},
      location: "Lviv",
      days: [],
      daysFull: [],
      temps: [],
      minTemps: [],
      maxTemps: [],
      weather: [],
      displayIndex: 0
    };
  }

  currentData = () => {
    const list = this.props.data.list;
    const nearestHr = this.computeNearestHr();
    return list.find(e => new Date(e.dt_txt).getHours() === nearestHr);
  };

  computeNearestHr = () => {
    const currentTimeInHrs = new Date().getHours();
    const constHrs = [0, 3, 6, 9, 12, 15, 18, 21];
    const differences = constHrs.map(e => Math.abs(e - currentTimeInHrs));
    const indexofLowestDiff = differences.indexOf(Math.min(...differences));

    return constHrs[indexofLowestDiff];
  };

  fillState = () => {
    const currentData = this.currentData();
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeekFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayFull = dayOfWeekFull[new Date(currentData.dt_txt).getDay()];
    const currentTemp = Math.round(currentData.main.temp);
    const currentMinTemp = Math.round(currentData.main.temp_min);
    const currentMaxTemp = Math.round(currentData.main.temp_max);
    const currentWeather =
      currentData.weather[0].main === "Clouds"
        ? "Cloudy"
        : currentData.weather[0].main;

    const days = {};
    const daysFull = [];
    const temps = [];
    const minTemps = [];
    const maxTemps = [];
    const weather = [];
    for (let i = 0; i < this.props.data.list.length; i++) {
      let date = new Date(Date.parse(this.props.data.list[i].dt_txt) - 10800 * 1000  + this.props.data.city.timezone * 1000);
      let day = dayOfWeek[date.getDay()];
      let dayFull = dayOfWeekFull[date.getDay()];
      daysFull.push(dayFull);
      temps.push(Math.round(this.props.data.list[i].main.temp));
      minTemps.push(Math.round(this.props.data.list[i].main.temp_min));
      maxTemps.push(Math.round(this.props.data.list[i].main.temp_max));

      if (this.props.data.list[i].weather[0].main === "Clouds") {
        weather.push("Cloudy");
      } else {
        weather.push(this.props.data.list[i].weather[0].main);
      }

      days[day] = days[day] ? [...days[day], date.getHours()] : [date.getHours()];
      days[day] = days[day] ? [...days[day], this.props.data.list[i].weather[0].icon] : [this.props.data.list[i].weather[0].icon];
    }

    this.setState({
      days: days,
      daysFull: [currentDayFull, ...daysFull.slice(1)],
      temps: [currentTemp, ...temps.slice(1)],
      minTemps: [currentMinTemp, ...minTemps.slice(1)],
      maxTemps: [currentMaxTemp, ...maxTemps.slice(1)],
      weather: [currentWeather, ...weather.slice(1)],
    });
  };

  async componentDidMount() {
    await this.props.fetchData(this.state.location);
    this.fillState();
  }

  handleFocus = e => {
    e.target.select();
  };

  changeLocation = (e, city) => {
    e.preventDefault();
    this.setState({
        location: city
      }, () => {
        this.props.fetchData(city)
          .then(() => this.fillState());
      }
    );
  };

  render() {
    const {
      location,
      days,
      daysFull,
      temps,
      maxTemps,
      minTemps,
      weather,
      displayIndex
    } = this.state;

    let background = "";
    switch (weather[displayIndex]) {
      case "Clear":
        background = "clear";
        break;
      case "Cloudy":
        background = "cloudy";
        break;
      case "Snow":
        background = "snow";
        break;
      case "Rain":
        background = "rain";
        break;
      case "Drizzle":
        background = "rain";
        break;
      case "Thunderstorm":
        background = "thunderstorm";
        break;
      default:
        background = "cloudy";
    }

    if(Object.keys(this.props.data).length === 0 || this.state.temps.length === 0){
      return <Loader/>
    }

    return (
     <div className='wrapper' style={{backgroundImage: `url(${this.props.img ? this.props.img : defaultBg})`}}>
       {/*<div className="banner"  />*/}
       <div className={"widget ".concat(...background)}>
         <Search
           defaultValue={location}
           citiesList={this.props.citiesList}
           getAvailableCities={this.props.getAvailableCities}
           changeLocation={this.changeLocation}
         />

         <div className="main-display">
           <div className="main-info">
             <div className="temp-measurement">{temps[displayIndex]}</div>
             <div className="temp-unit">°C</div>
           </div>

           <div className="sub-info">
             <div className="sub-info-title">{daysFull[displayIndex]}</div>

             <div className="sub-info-text">{weather[displayIndex]}</div>

             <div className="sub-info-text">
              <span className="max-temp">
                <i className="mdi mdi-arrow-up" />
                {maxTemps[displayIndex]}
                °C
              </span>
               <span className="min-temp">
                <i className="mdi mdi-arrow-down" />
                 {minTemps[displayIndex]}
                 °C
              </span>
             </div>
           </div>
         </div>

         <div className="selection-panel">
           <div className="test">
             <AppBar position="static">
               <Tabs value={this.state.displayIndex} onChange={(e, ind) => this.setState({displayIndex: ind})} aria-label="simple tabs example">
                 {Object.keys(days).map((item, index) =>
                   <Tab
                     key={index + 1}
                     label={index === 0 ? 'Today' : item}
                   />
                 )}
               </Tabs>
             </AppBar>
             {Object.values(days).map((item, index) =>
               <TabPanel value={this.state.displayIndex} index={index} key={index} className='selection-icons-wrap'>
                 {item.map((el, ind) =>
                   <div className="selection-icons" key={ind}>
                     {ind % 2 === 0
                       ? <span>{el}:00 - {el + 3 > 24 ? el + 3 - 24 : el + 3}:00</span>
                       : <img src={`http://openweathermap.org/img/wn/${el}.png`}  alt=""/>
                     }
                   </div>
                 )}
               </TabPanel>
             )}
           </div>
         </div>
       </div>
     </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.weather.data,
    img: state.weather.img,
    citiesList: state.weather.citiesList,
  }
};

const mapDispatchToProps = {
  fetchData: fetchData,
  getAvailableCities: getAvailableCities
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
