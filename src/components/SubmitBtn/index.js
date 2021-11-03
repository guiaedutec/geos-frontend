/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';
import styles from './Button.styl';

export default class SubmitBTn extends React.Component {
  render() {
    const { disabled, icon } = this.props;
    const iconName = disabled ? `${icon}-disabled` : icon;
    const buttonClassName = classNames(
      'button',
      styles.button__rounded,
      styles.button__normal,
      this.props.className,
      {
        [styles.button__disabled]: disabled,
      }
    );

    return <button
      {...this.props}
      className={buttonClassName}
    >
     <Icon name={iconName}/>
      {this.props.children}
    </button>;
  }
}
