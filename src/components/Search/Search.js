import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Search.scss';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autocompleteOpen: false
    };
  }

  onChangeValue = (event) => {
    if(document.querySelector('#search__list-popup')){
      console.log(event.target.value)

      this.props.changeLocation(event, document.querySelector('#search__list-popup li[data-focus=true] div').textContent)
    }
    // event.target.value.length > 0 ? this.setState({autocompleteOpen: true}) : this.setState({autocompleteOpen: false})
    // console.log(this.state.autocompleteOpen)
  };

  onBlur = () => {
    this.setState({autocompleteOpen: false});
  };

  render() {

    return (
      <div className="search " >
        <Autocomplete
          freeSolo
          id="search__list"
          // open={true}
          // open={this.state.autocompleteOpen}

          // disableOpenOnFocus
          defaultValue={this.props.defaultValue}
          disableClearable
          options={this.props.citiesList.map(item => item)}
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