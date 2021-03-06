import React, { Component } from 'react';
import { isEmpty } from 'lodash';

import Header from './header';
import Decision from './decision';
import Options from './options/options';
import Add from './add';
import Selected from './options/selected';
import Checkbox from "./checkbox/checkbox";

class Decide4me extends Component {
  constructor(props) {
    super(props);

    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.removeAllOptions = this.removeAllOptions.bind(this);
    this.decide = this.decide.bind(this);
    this.clearSelectedOption = this.clearSelectedOption.bind(this);
    this.changeRemovalAfterSelectionSetting = this.changeRemovalAfterSelectionSetting.bind(this);

    this.state = {
      options: [],
      selectedOption: undefined,
      removeAfterSelection: false
    };
  }

  componentDidMount() {
    try {
      const json = localStorage.getItem('options');
      const fromLocal = JSON.parse(json);

      const search = this.props.location.search;
      const fromURL = new URLSearchParams(search).get('options');

      const options =
      [...new Set(
        [
          ...fromLocal,
          ...(isEmpty(fromURL) ? [] : fromURL.split(',')).filter(option => !isEmpty(option)),
        ]
      )];

      if (options) {
        this.setState(() => ({options}));
      }
    } catch (e) { }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.options.length !== this.state.options.length) {
      const json = JSON.stringify(this.state.options);
      localStorage.setItem('options', json);
    }
  }

  addOption(option) {
    if (!option) {
      return 'Enter a valid option';
    } else if (this.state.options.includes(option)) {
      return 'This option already exists';
    }

    this.setState((state) => ({
      options: [...state.options, option],
    }));
  }

  removeOption(option) {
    this.setState((state) => ({
      options: state.options.filter((stateOption) => stateOption !== option),
    }));
  }

  removeAllOptions() {
    this.setState(() => ({ options: [] }));
  }

  decide() {
    const randomIndex = Math.floor(Math.random() * this.state.options.length);
    const option = this.state.options[randomIndex];
    this.setState(() => ({ selectedOption: option }));
  }

  clearSelectedOption() {
    if(this.state.removeAfterSelection){
      this.removeOption(this.state.selectedOption);
    }
    this.setState(() => ({ selectedOption: undefined }));
  }

  changeRemovalAfterSelectionSetting(event) {
    const value = event.target.checked;
    this.setState(() => ({
      removeAfterSelection: value
    }));
  }

  render() {
    return (
      <div>
        <Header
          title={this.props.title}
          subtitle={this.props.subtitle}/>
        <div className="container">
          <Decision
            decide={this.decide}
            disabled={this.state.options.length === 0}/>
          <div className="full-width ">
            <Checkbox checked={this.state.removeAfterSelection}
                      handleChange={this.changeRemovalAfterSelectionSetting}
                      label={"Remove option after selection"}/>
          </div>
          <div className="full-width widget">
            <Options
              options={this.state.options}
              removeOption={this.removeOption}
              removeAllOptions={this.removeAllOptions}/>
            <Add
              addOption={this.addOption}/>
          </div>
          <Selected
            selectedOption={this.state.selectedOption}
            clearSelectedOption={this.clearSelectedOption}/>
        </div>
      </div>
    );
  }
}

export default Decide4me;
