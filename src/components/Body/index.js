import React from 'react';
import classNames from 'classnames';
import styles from './Body.styl';

export default class Body extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <div className={classNames(this.props.className)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
