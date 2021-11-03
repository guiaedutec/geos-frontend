import React from 'react';
import classNames from 'classnames';
import styles from './Icon.styl';

export default (props) => (
  <i data-number={props.number} className={
    classNames(
      props.className,
      styles[`icon-${props.name}`]
    )
  }/>
);
