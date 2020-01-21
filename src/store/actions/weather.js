import axios from "axios/index";
import {GET_AVAILABLE_CITIES, GET_WEATHER_START, GET_WEATHER_SUCCESS} from "./actionType";
import cities from '../../components/App/city.list.min'

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


  let payload = cityData ? [res.data, cityData.data.photos[0].image.web] : [res.data];

  dispatch({
    type: GET_WEATHER_SUCCESS,
    payload: payload
  })
};

export const getAvailableCities = query => async dispatch => {
  if(query.length > 2){
    let citiesList = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(cities), 4)
      // reject('error')
    });
    query = query[0].toUpperCase() + query.slice(1);
    citiesList = citiesList.filter(city => {
      return city.name.startsWith(query)
    });
    citiesList = new Set(citiesList.map(item => item.name));
    dispatch({
      type: GET_AVAILABLE_CITIES,
      payload: citiesList
    })
  }
}