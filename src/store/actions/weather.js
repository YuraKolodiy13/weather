import axios from "axios/index";
import {GET_AVAILABLE_CITIES, GET_CITIES_JSON, GET_WEATHER_START, GET_WEATHER_SUCCESS} from "./actionType";
import store from '../store'
export const fetchData = city => async dispatch => {
  dispatch({
    type: GET_WEATHER_START
  });
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.replace(' ', '+')}&APPID=fb1158dc7dfef5f0967ceac8f71ee3a6&units=metric`;
  console.log(url)
  const res = await axios.get(url);

  city = city.toLowerCase();

  let cityData;

  try {
    cityData = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.split(' ').join('-')}/images/`);
    // const cityData = await axios.get(`https://api.teleport.org/api/cities/?search=${city}&embed=city%3Asearch-results%2Fcity%3Aitem`);

  }catch (e) {
    console.log(e)
  }

  let payload = cityData ? [res.data, cityData.data.photos[0].image.mobile] : [res.data];

  dispatch({
    type: GET_WEATHER_SUCCESS,
    payload: payload
  })
};
export const fetchCitiesJson = () => async dispatch => {
  let citiesList = await axios.get('https://raw.githubusercontent.com/YuraKolodiy13/weather/master/src/components/App/cities.json');
  dispatch({
    type: GET_CITIES_JSON,
    payload: citiesList.data
  })
};

export const getAvailableCities = query => async dispatch => {
  let filteredCitiesList = store.getState().weather.citiesList;
  if(query.length >= 3){
    query = query.split(' ').length === 1 ? query[0].toUpperCase() + query.slice(1) : query.split(' ').map(item => item ? item[0].toUpperCase() + item.slice(1) : '').join(' ');
    filteredCitiesList = filteredCitiesList.filter(city => {
      return city.startsWith(query)
    });

    dispatch({
      type: GET_AVAILABLE_CITIES,
      payload: filteredCitiesList
    })
  }else{
    dispatch({
      type: GET_AVAILABLE_CITIES,
      payload: []
    })
  }
};