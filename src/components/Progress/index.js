import React from "react";
import classNames from "classnames";

import styles from "./Progress.styl";

export default class Progress extends React.Component {
  render() {
    const { items } = this.props;

    return (
      <div className={styles.progress_container}>
        {items.map((stage, index) => (
          <div
            key={stage.key}
            style={{
              flex:
                index + 1 === items.length
                  ? stage.items.length - 1
                  : stage.items.length,
            }}
            className={classNames(
              styles[stage.className],
              styles.progress_stage
            )}
          >
            <strong style={{ color: stage.color }}>{stage.title}</strong>

            <div>
              {stage.items.map((item) => (
                <div
                  key={item.key}
                  className={classNames(
                    styles.progress_item,
                    item.check ? styles.progress_item_check : ""
                  )}
                >
                  <span />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
