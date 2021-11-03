import React, {Component} from 'react';
import {PulseLoader} from 'react-spinners';
import styles from './Dashboard.styl';
import classNames from 'classnames';

import VisibilitySensor from 'react-visibility-sensor';
import CountUp, { startAnimation } from 'react-countup';

export default class CountNumber extends Component {
  static defaultProps = {
    start: 0,
    end: 0,
    duration: 2.75
  }

  constructor() {
    super();
    this.state = {
      hasVisible: false
    };
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  onVisibilityChange(isVisible) {
    if (!this.state.hasVisible && isVisible) {
      startAnimation(this.countUp);
      this.setState({
        hasVisible: true
      })
    }
  }

  render() {
    return (
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        delayedCall
      >
        <div>
          <PulseLoader
            color={this.props.colorLoading ? this.props.colorLoading : '#131D3C'}
            size={8}
            loading={this.props.loading}
          />
          <CountUp
            className={classNames(styles.count_number, this.props.loading ? "hidden" : "")}
            start={this.props.stat}
            end={this.props.end}
            duration={this.props.duration}
            separator="."
            useGrouping={true}
            ref={(countUp) => { this.countUp = countUp; }} />
        </div>
      </VisibilitySensor>
    )
  }
}
