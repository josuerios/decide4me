import React, { Component } from 'react';
import Header from './header';
import Decision from './decision';
import Options from './options/options';
import Add from './add';

class Decide4me extends Component {
  constructor(props) {
    super(props);

    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.removeAllOptions = this.removeAllOptions.bind(this);
    this.decide = this.decide.bind(this);

    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    try {
      const json = localStorage.getItem('options');
      const options = JSON.parse(json);

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
    console.log(option);
  }

  render() {
    return (
      <div>
        <Header
          title={this.props.title}
          subtitle={this.props.subtitle}/>
        <Decision
          decide={this.decide}
          disabled={this.state.options.length === 0}/>
        <Options
          options={this.state.options}
          removeOption={this.removeOption}
          removeAllOptions={this.removeAllOptions}/>
        <Add
          addOption={this.addOption}/>
      </div>
    );
  }
}

export default Decide4me;
