import React from 'react';
import classnames from 'classnames';
import NumberFormat from 'react-number-format';

import styles from './amountsof.styl';

class AmountOf extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
          <div className={classnames(styles.text_align_center)}>
            <span className={classnames(styles.amount)}><NumberFormat value={this.props.count} displayType={'text'} thousandSeparator="." decimalSeparator="," /></span>
            <br/>
            <span className={classnames(styles.amount_description)}>{this.props.text}</span>
          </div>
    );
  }
}
export default AmountOf;
