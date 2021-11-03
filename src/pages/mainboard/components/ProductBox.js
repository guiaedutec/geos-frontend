import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.styl";
import classNames from "classnames";
import _ from "lodash";

class ProductBox extends React.Component {
  render() {
    return (
      <article
        className={classNames(
          "media",
          this.props.disabled === undefined ? null : styles.disabled
        )}
      >
        <figure className="media-left image is-64x64 is-hidden-tablet-only is-hidden-desktop-only">
          <img src={this.props.img} alt={this.props.imgAlt} />
        </figure>
        <div className="media-content">
          <a
            className={styles.link}
            href={this.props.disabled === undefined ? this.props.link : null}
          >
            <div className={classNames("content", styles.content)}>
              <span
                className={classNames(
                  "tag is-black is-rounded is-uppercase",
                  styles.type,
                  styles[_.kebabCase(this.props.type)]
                )}
              >
                {this.props.type}
              </span>
              <h4
                className={classNames(
                  "is-uppercase has-text-weight-bold",
                  styles.title
                )}
              >
                {this.props.title}
              </h4>
              <p className={classNames("subtitle", styles.subtitle)}>
                {this.props.subTitle}
              </p>
            </div>
          </a>
        </div>
      </article>
    );
  }
}

ProductBox.propTypes = {
  type: PropTypes.string.isRequired,
  img: PropTypes.string,
  imgAlt: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  link: PropTypes.string.isRequired,
  disabled: PropTypes.string,
};

export default ProductBox;
