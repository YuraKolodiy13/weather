import {GET_AVAILABLE_CITIES, GET_CITIES_JSON, GET_WEATHER_START, GET_WEATHER_SUCCESS} from "../actions/actionType";

const initialState = {
  data: {},
  img: null,
  citiesList: [],
  filteredCitiesList: []
};

const weather = (state = initialState, action) => {
  switch (action.type){
    case GET_WEATHER_START:
      return {
        ...state,
        loading: true
      };
    case GET_WEATHER_SUCCESS:
      return {
        ...state,
        data: action.payload[0],
        img: action.payload[1],
        loading: false
      };
    case GET_CITIES_JSON:
      return {
        ...state,
        citiesList: action.payload
      };
    case GET_AVAILABLE_CITIES:
      return {
        ...state,
        // citiesList: Array.from(action.payload)
        filteredCitiesList: action.payload
      };

    default:
      return state
  }
};

export default weather