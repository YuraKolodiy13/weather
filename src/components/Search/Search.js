import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Search.scss';


class Search extends Component {
  onChangeValue = (event) => {
    if(document.querySelector('#search__list-popup')){
      document.querySelector('#search__list-popup li[data-focus=true] div')
        ? this.props.changeLocation(event, document.querySelector('#search__list-popup li[data-focus=true] div').textContent)
        : this.props.changeLocation(event, event.target.value);
    }
  };

  render() {
    return (
      <div className="search " >
        <Autocomplete
          freeSolo
          id="search__list"
          defaultValue={this.props.defaultValue}
          disableClearable
          options={this.props.filteredCitiesList.map(item => item)}
          onInput={(e) => this.props.getAvailableCities(e.target.value)}
          onChange={this.onChangeValue}
          renderOption={option => (
            <div
              tabIndex="0"
              className="search__item"
              onKeyDown={(e) => console.log(43254)}
              onClick={(e) => this.props.changeLocation(e, option)}
            >{option}</div>
          )}
          getOptionLabel={option => option}

          renderInput={params => (
            <TextField
              {...params}
              // label="Search city"
              // variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{...params.InputProps, type: 'search'}}
            />
          )}
        />
      </div>
    );
  }
}

export default Search;