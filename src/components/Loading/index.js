import React from "react";
import classnames from "classnames";
import styles from "./Loading.styl";
import { PulseLoader } from "react-spinners";

export default class Loading extends React.Component {
  render() {
    return (
      <div className={classnames("container", styles.loading_container)}>
        <PulseLoader color="#e65c2d" />
      </div>
    );
  }
}
