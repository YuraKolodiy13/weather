import React from 'react';
import './App.scss';
import {fetchCitiesJson, fetchData, getAvailableCities} from "../../store/actions/weather";
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
      location: localStorage.getItem('city') || "Lviv",
      days: [],
      daysFull: [],
      temps: [],
      minTemps: [],
      maxTemps: [],
      weather: [],
      sun: [],
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
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
    const sunInfo =[];
    for (let i = 0; i < this.props.data.list.length; i++) {
      let date = new Date(Date.parse(this.props.data.list[i].dt_txt) - 10080 * 1000  + this.props.data.city.timezone * 1000);
      let day = dayOfWeek[date.getDay()];
      day = day + '-' + date.getDate() + '-' + months[date.getMonth()];
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
      days[day] = days[day] ? {...days[day], hours: [...days[day].hours, date.getHours()]} : {...days[day], hours: [date.getHours()]};
      days[day] = days[day] && days[day].hours.length > 1 ? {...days[day], icons: [...days[day].icons, this.props.data.list[i].weather[0].icon]} : {...days[day], icons: [this.props.data.list[i].weather[0].icon]};
      days[day] = days[day] && days[day].icons.length > 1 ? {...days[day], temp: [...days[day].temp, Math.round(this.props.data.list[i].main.temp)]} : {...days[day], temp: [Math.round(this.props.data.list[i].main.temp)]};
      days[day] = days[day] && days[day].temp.length > 1 ? {...days[day], feels: [...days[day].feels, Math.round(this.props.data.list[i].main.feels_like)]} : {...days[day], feels: [Math.round(this.props.data.list[i].main.feels_like)]};
      days[day] = days[day] && days[day].feels.length > 1 ? {...days[day], pressure: [...days[day].pressure, Math.round(this.props.data.list[i].main.pressure * 0.75)]} : {...days[day], pressure: [Math.round(this.props.data.list[i].main.pressure * 0.75)]}
      days[day] = days[day] && days[day].pressure.length > 1 ? {...days[day], humidity: [...days[day].humidity, this.props.data.list[i].main.humidity]} : {...days[day], humidity: [this.props.data.list[i].main.humidity]};
      days[day] = days[day] && days[day].humidity.length > 1 ? {...days[day], wind: [...days[day].wind, this.props.data.list[i].wind.speed]} : {...days[day], wind: [this.props.data.list[i].wind.speed]};
    }

    for(let i = 0; i < 2; i++){
      let sun = i > 0 ? 'sunset' : 'sunrise';
      let hour = (new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getHours() + '').length === 1
        ? '0' + new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getHours()
        : new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getHours();
      hour += ':';
      hour += (new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getMinutes() + '').length === 1
        ? '0' + new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getMinutes()
        : new Date((this.props.data.city[sun] - 7200 + this.props.data.city.timezone) * 1000).getMinutes();
      sunInfo.push(hour)
    }

    this.setState({
      days: days,
      sunInfo: sunInfo,
      daysFull: [currentDayFull, ...daysFull.slice(1)],
      temps: [currentTemp, ...temps.slice(1)],
      minTemps: [currentMinTemp, ...minTemps.slice(1)],
      maxTemps: [currentMaxTemp, ...maxTemps.slice(1)],
      weather: [currentWeather, ...weather.slice(1)],
    });
  };

  async componentDidMount() {
    this.props.fetchCitiesJson();
    await this.props.fetchData(this.state.location);
    this.fillState();
  }


  handleFocus = e => {
    e.target.select();
  };

  changeLocation = (e, city) => {
    localStorage.setItem('city', city);
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

    if(Object.keys(this.props.data).length === 0 || this.state.temps.length === 0){
      return <Loader/>
    }

    return (
     <div className='wrapper' style={{backgroundImage: `url(${this.props.img ? this.props.img : defaultBg})`}}>
       <div className="widget">
         <Search
           defaultValue={location}
           filteredCitiesList={this.props.filteredCitiesList}
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

           <div className="sub-info">
             <div className='sub-info-text'>Sunrise {this.state.sunInfo[0]}</div>
             <div className='sub-info-text'>Sunset {this.state.sunInfo[1]}</div>
           </div>
         </div>

         <div className="selection-panel">
           <div className="test">
             <AppBar position="static">
               <Tabs value={this.state.displayIndex} onChange={(e, ind) => this.setState({displayIndex: ind})} aria-label="simple tabs example">
                 {Object.keys(days).map((item, index) =>
                   <Tab
                     key={index + 1}
                     label={item.split('-').join(' ')}
                   >
                   </Tab>
                 )}
               </Tabs>
             </AppBar>
             {Object.values(days).map((item, index) =>
               <TabPanel value={this.state.displayIndex} index={index} key={index} className='selection-icons-wrap'>
                 <div className="selection-icons selection-icons--info">
                   <span className='selection-icons-hide-desktop'>Hours, hh:mm</span>
                   <span className='selection-icons-hide-desktop'>Sky</span>
                   <span>Temperature, °C</span>
                   <span>Feels like, °C</span>
                   <span>Pressure, mm</span>
                   <span>Humidity, %</span>
                   <span>Wind, m/s</span>
                 </div>
                 {item.hours.map((el, ind) =>
                   <div className="selection-icons" key={ind}>
                     <span>{(''+el).length === 1 ? '0' + el : el}:00 - {el + 3 > 24 ? (el + 3 - 24 + '').length === 1 ? '0' + (el + 3 - 24) : el + 3 - 24 : (''+(el+3)).length === 1 ? '0' + (el + 3) : el + 3}:00</span>
                     <span><img src={`http://openweathermap.org/img/wn/${item.icons[ind]}.png`}  alt=""/></span>
                     <span>{('' + item.temp[ind]).length === 1 ? '+' + item.temp[ind] : item.temp[ind]}°</span>
                     <span>{('' + item.feels[ind]).length === 1 ? '+' + item.feels[ind] : item.feels[ind]}°</span>
                     <span>{item.pressure[ind]}</span>
                     <span>{item.humidity[ind]}</span>
                     <span>{item.wind[ind]}</span>
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
    filteredCitiesList: state.weather.filteredCitiesList,
  }
};

const mapDispatchToProps = {
  fetchData: fetchData,
  getAvailableCities: getAvailableCities,
  fetchCitiesJson: fetchCitiesJson
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
