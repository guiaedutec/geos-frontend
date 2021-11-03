import React from "react";
import styles from "./Footer.styl";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import LogoGuiaEdutec from "../LogoGuiaEdutec";

function Footer({ intl }) {
  const translate = (id) => {
    return intl.formatMessage({ id });
  };

  return (
    <footer
      className={classnames("footer is-fullwidth not_print", styles.footer)}
    >
      <div className="container content">
        <div className="columns">
          <div className={classnames("column is-two-fifths", styles.address)}>
            <p>
              <a
                href={parse(translate("StaticLinks.mainLink"))}
                target="_blank"
                className="mr-15"
              >
                <strong>CIEB</strong>
              </a>{" "}
              {parse(translate("Footer.address"))}
            </p>
            <span className={classnames(styles.copyright, "is-uppercase")}>
              {parse(translate("Footer.copyright"))}
            </span>
          </div>
          <div className={classnames("column", styles.see_more)}>
            <p className="is-uppercase">
              <strong>{parse(translate("Footer.discover"))}</strong>
            </p>
            <ul>
              <li>
                <a
                  href={parse(translate("Footer.bulletLink1"))}
                  target="_blank"
                >
                  {parse(translate("Footer.bullet1"))}
                </a>
              </li>
              <li>
                <a
                  href={parse(translate("Footer.bulletLink2"))}
                  target="_blank"
                >
                  {parse(translate("Footer.bullet2"))}
                </a>
              </li>
              <li>
                <a
                  href={parse(translate("Footer.bulletLink3"))}
                  target="_blank"
                >
                  {parse(translate("Footer.bullet3"))}
                </a>
              </li>
            </ul>
          </div>
          <div className={classnames("column", styles.policy_links)}>
            <div>
              <a href={parse(translate("Footer.bulletLink4"))} target="_blank">
                {parse(translate("Footer.bullet4"))}
              </a>
              <a href={parse(translate("Footer.bulletLink5"))} target="_blank">
                {parse(translate("Footer.bullet5"))}
              </a>
              <a href={parse(translate("Footer.bulletLink6"))} target="_blank">
                {parse(translate("Footer.bullet6"))}
              </a>
            </div>
            <LogoGuiaEdutec isSmall />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default injectIntl(Footer);
