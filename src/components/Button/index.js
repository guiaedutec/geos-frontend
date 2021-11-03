import React from "react";
import PropTypes from "prop-types";
import history from "../../core/history";
import classNames from "classnames";
import _ from "lodash";

import Icon from "../Icon";
import styles from "./Button.styl";

export default class Button extends React.Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClick: PropTypes.func,
    href: PropTypes.string,
    number: PropTypes.string,
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (event.button !== 0 /* left click */) {
      return;
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();

    if (this.props.to) {
      history.push(this.props.to);
    } else {
      history.push({
        pathname: event.currentTarget.pathname,
        search: event.currentTarget.search,
      });
    }
  };

  render() {
    const { to, href, className, disabled, icon, number } = this.props;
    const props = _.omit(this.props, ["to", "className", "icon", "number"]);
    const iconName = disabled ? `${icon}-disabled` : icon;
    const buttonClassName = classNames(
      "button",
      styles.button__rounded,
      styles.button__normal,
      className,
      {
        [styles.button__disabled]: disabled,
      }
    );

    return (
      <a
        href={to ? history.createHref(to) : href || "#"}
        className={buttonClassName}
        onClick={href ? null : this.handleClick}
        {...props}
      >
        {icon && (
          <Icon className={owner_icon} name={iconName} number={number} />
        )}
        {props.children}
      </a>
    );
  }
}
