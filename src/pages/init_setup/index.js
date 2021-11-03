import React, { Component } from "react";
import Helmet from "react-helmet";
import DropdownLanguage from "~/components/Header/DropdownLanguage";
import Field from "~/components/Form/Field";
import styles from "./styles.styl";
import axios from "axios";
import CONF from "~/api/index";
import history from "~/core/history";
import ReactModal from "react-modal";
import classnames from "classnames";
import stylesModal from "~/components/Modal/Modal.styl";
import API from "~/api";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import validate from "validate.js";
import schema from "./schema";

const SubTitle = ({ children }) => {
  return (
    <span
      style={{
        fontSize: "0.8em",
        fontStyle: "italic",
        marginBottom: "-0.5em 0 0.5em",
      }}
    >
      {children}
    </span>
  );
};

class InitSetup extends Component {
  constructor() {
    super();
    this.state = {
      setupIsDone: true,
      colorPrimary: "",
      colorSecondary: "",
      imgBgHome: "",
      imgLogoFooter: "",
      imgLogoFooterSec: "",
      imgLogoHeader: "",
      imgLogoHeaderSec: "",
      adminPwd: "",
      email: "",
      imgLogoFooterName: "",
      imgLogoFooterSecName: "",
      imgLogoHeaderName: "",
      imgLogoHeaderSecName: "",
      mainLink: "",
      mainEmail: "",
      questions: "",
      termLink: "",
      technicalNotes: "",
      questionsExample: "",
      feedbackExample: "",
      showModal: false,
      adminToken: "",
      file: {},
      langs: [],
      isLoading: false,
      errors: {},
    };
    this.submitTranslations = this.submitTranslations.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.submitSetupData = this.submitSetupData.bind(this);
    this.fetchTranslations = this.fetchTranslations.bind(this);
  }

  async componentDidMount() {
    this.fetchTranslations();
    this.fetchLangs();
    const setupIsDone = await this.fetchSetupData();
    if (setupIsDone) {
      history.push("/");
    }
  }

  getLang() {
    return localStorage.getItem("lang");
  }

  async fetchTranslations() {
    const lang = this.getLang();
    const URL_REQUEST = CONF.ApiURL + `/api/v1/translation/${lang}`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState(response.data.data[0].StaticLinks);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  async login() {
    const response = await API.Users.login({
      email: this.state.email,
      password: this.state.adminPwd,
    });
    this.setState({ adminToken: response.authenticity_token });
  }

  showModal() {
    this.setState({ showModal: false });
  }

  fileUpload(e, name) {
    const file = e.target.files[0];
    const formData = new FormData();
    var fr;
    formData.append(name, file);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        [`${name}Name`]: file.name,
        [name]: reader.result,
      });
    };

    e.target.value = "";
  }

  async fetchLangs() {
    const URL_REQUEST = CONF.ApiURL + "/api/v1/langs";
    const response = await axios.get(URL_REQUEST);
    const langs = response.data.data.map((language) => language.lang);
    this.setState({ langs });
  }

  async fetchSetupData() {
    const URL_REQUEST = CONF.ApiURL + "/api/v1/setup/";
    const response = await axios.get(URL_REQUEST);
    const { setupIsDone } = response.data.data;

    return setupIsDone;
  }

  async submitTranslations(lang) {
    const {
      mainLink,
      mainEmail,
      questions,
      termLink,
      technicalNotes,
      questionsExample,
      feedbackExample,
      adminToken,
    } = this.state;

    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/translation/?access_token=${adminToken}&lang=` +
      `${lang}`;

    const data = {
      translation: {
        StaticLinks: {
          mainLink,
          mainEmail,
          questions,
          termLink,
          technicalNotes,
          questionsExample,
          feedbackExample,
        },
        lang,
      },
    };
    try {
      const response = await axios.post(URL_REQUEST, data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async submitSetupData() {
    const URL_REQUEST = CONF.ApiURL + "/api/v1/setup";
    const {
      setupIsDone,
      colorPrimary,
      colorSecondary,
      imgBgHome,
      imgLogoFooter,
      imgLogoFooterSec,
      imgLogoHeader,
      imgLogoHeaderSec,
      adminPwd,
      email,
    } = this.state;

    const data = {
      setupIsDone,
      colorPrimary,
      colorSecondary,
      imgBgHome,
      imgLogoFooter,
      imgLogoFooterSec,
      imgLogoHeader,
      imgLogoHeaderSec,
      adminPwd,
      email,
    };
    try {
      this.setState({ isLoading: true });
      const response = await axios.post(URL_REQUEST, {
        parameter: { ...data },
      });

      await this.login();
      await this.state.langs.forEach((lang) => this.submitTranslations(lang));
      this.setState({ isLoading: false });
      window.location = "/painel";
    } catch (error) {
      console.log(error.message);
      this.setState({ isLoading: false });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const {
      setupIsDone,
      colorPrimary,
      colorSecondary,
      imgBgHome,
      imgLogoFooter,
      imgLogoFooterSec,
      imgLogoHeader,
      imgLogoHeaderSec,
      adminPwd,
      email,
    } = this.state;

    const data = {
      setupIsDone,
      colorPrimary,
      colorSecondary,
      imgBgHome,
      imgLogoFooter,
      imgLogoFooterSec,
      imgLogoHeader,
      imgLogoHeaderSec,
      password: adminPwd,
      email,
    };
    const errors = validate(data, schema, { fullMessages: false });

    if (errors) {
      this.setState({ errors });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      this.setState({ errors: {} });
      this.setState({ showModal: true });
    }
  }

  render() {
    const { errors } = this.state;
    return [
      <Helmet title={parse(this.translate("InitSetup.pageHeader"))} />,
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-full">
              <DropdownLanguage direction="left" />
            </div>
            <div className="column is-full">
              <div className="box is-size-5">
                {parse(this.translate("InitSetup.description"))}
              </div>
            </div>
          </div>
          <form onSubmit={this.handleFormSubmit}>
            <div className="box">
              <div className="columns is-multiline">
                <div className="column is-full">
                  <h1 className={styles.title_section}>
                    {parse(this.translate("InitSetup.changeAdminPassword"))}
                  </h1>
                  <Field
                    type="email"
                    label={parse(this.translate("InitSetup.email"))}
                    description={parse(
                      this.translate("InitSetup.emailDescription")
                    )}
                    name="email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                    error={errors && errors.email}
                  />

                  <Field
                    type="password"
                    label={parse(this.translate("InitSetup.adminPwd"))}
                    description={parse(
                      this.translate("InitSetup.adminPwdDescription")
                    )}
                    name="adminPwd"
                    onChange={(e) =>
                      this.setState({ adminPwd: e.target.value })
                    }
                    error={errors && errors.password}
                  />
                </div>
              </div>
            </div>

            <div className="box">
              <div className="columns is-multiline">
                <div className="column is-full">
                  <h1 className={styles.title_section}>
                    {parse(this.translate("InitSetup.layoutSettings"))}
                  </h1>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-half">
                  <h1>{parse(this.translate("InitSetup.imgLogoHeader"))}</h1>
                  <SubTitle>
                    {parse(
                      this.translate("InitSetup.imgLogoHeaderDescription")
                    )}
                  </SubTitle>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputFile}>
                      {this.state.imgLogoHeaderName
                        ? this.state.imgLogoHeaderName
                        : parse(this.translate("InitSetup.chooseOneFle"))}
                      <input
                        type="file"
                        accept="image/*"
                        name="imgLogoHeader"
                        onChange={(e) => this.fileUpload(e, "imgLogoHeader")}
                      />
                    </label>
                  </div>
                  <span className={styles.error}>
                    {errors && errors.imgLogoHeader}
                  </span>
                </div>

                <div className="column is-half">
                  <h1>{parse(this.translate("InitSetup.imgLogoHeaderSec"))}</h1>
                  <SubTitle>
                    {parse(
                      this.translate("InitSetup.imgLogoHeaderSecDescription")
                    )}
                  </SubTitle>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputFile}>
                      {this.state.imgLogoHeaderSecName
                        ? this.state.imgLogoHeaderSecName
                        : parse(this.translate("InitSetup.chooseOneFle"))}
                      <input
                        type="file"
                        accept="image/*"
                        name="imgLogoHeaderSec"
                        onChange={(e) => this.fileUpload(e, "imgLogoHeaderSec")}
                      />
                    </label>
                  </div>
                  <span className={styles.error}>
                    {errors && errors.imgLogoHeaderSec}
                  </span>
                </div>

                <div className="column is-half">
                  <h1>{parse(this.translate("InitSetup.imgLogoFooter"))}</h1>
                  <SubTitle>
                    {parse(
                      this.translate("InitSetup.imgLogoFooterDescription")
                    )}
                  </SubTitle>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputFile}>
                      {this.state.imgLogoFooterName
                        ? this.state.imgLogoFooterName
                        : parse(this.translate("InitSetup.chooseOneFle"))}

                      <input
                        type="file"
                        accept="image/*"
                        name="imgLogoFooter"
                        onChange={(e) => this.fileUpload(e, "imgLogoFooter")}
                      />
                    </label>
                  </div>
                  <span className={styles.error}>
                    {errors && errors.imgLogoFooter}
                  </span>
                </div>

                <div className="column is-half">
                  <h1>{parse(this.translate("InitSetup.imgLogoFooterSec"))}</h1>
                  <SubTitle>
                    {parse(
                      this.translate("InitSetup.imgLogoFooterSecDescription")
                    )}
                  </SubTitle>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputFile}>
                      {this.state.imgLogoFooterSecName
                        ? this.state.imgLogoFooterSecName
                        : parse(this.translate("InitSetup.chooseOneFle"))}
                      <input
                        type="file"
                        accept="image/*"
                        name="imgLogoFooterSec"
                        onChange={(e) => this.fileUpload(e, "imgLogoFooterSec")}
                      />
                    </label>
                  </div>
                  <span className={styles.error}>
                    {errors && errors.imgLogoFooterSec}
                  </span>
                </div>

                <div className="column is-full">
                  <h1>{parse(this.translate("InitSetup.imgBgHome"))}</h1>
                  <SubTitle>
                    {parse(this.translate("InitSetup.imgBgHomeDescription"))}
                  </SubTitle>
                  <div className={styles.inputContainer}>
                    <label className={styles.inputFile}>
                      {this.state.imgBgHomeName
                        ? this.state.imgBgHomeName
                        : parse(this.translate("InitSetup.chooseOneFle"))}

                      <input
                        type="file"
                        accept="image/*"
                        name="imgBgHome"
                        onChange={(e) => this.fileUpload(e, "imgBgHome")}
                      />
                    </label>
                  </div>
                  <span className={styles.error}>
                    {errors && errors.imgBgHome}
                  </span>
                </div>
              </div>

              <div className="columns is-multiline">
                <div className="column is-full">
                  <div className="notification">
                    {parse(this.translate("InitSetup.colorsDescription"))}
                  </div>
                </div>
                <div className="column is-half">
                  <Field
                    type="text"
                    name="colorPrimary"
                    classField="slim-max"
                    label={parse(this.translate("InitSetup.colorPrimary"))}
                    description={parse(
                      this.translate("InitSetup.colorPrimaryDescription")
                    )}
                    onChange={(e) =>
                      this.setState({ colorPrimary: e.target.value })
                    }
                    error={errors && errors.colorPrimary}
                  />
                </div>
                <div className="column is-half">
                  <Field
                    type="text"
                    name="colorSecondary"
                    classField="slim-max"
                    label={parse(this.translate("InitSetup.colorSecondary"))}
                    description={parse(
                      this.translate("InitSetup.colorSecondaryDescription")
                    )}
                    onChange={(e) =>
                      this.setState({ colorSecondary: e.target.value })
                    }
                    error={errors && errors.colorSecondary}
                  />
                </div>
              </div>
            </div>

            <div className="box">
              <div className="columns is-multiline">
                <div className="column is-full">
                  <h1 className={styles.title_section}>
                    {parse(this.translate("InitSetup.staticLinks"))}
                  </h1>
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.mainLink"))}
                    description={parse(
                      this.translate("InitSetup.mainDescription")
                    )}
                    value={this.state.mainLink}
                    name="mainLink"
                    onChange={(e) =>
                      this.setState({ mainLink: e.target.value })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.mainEmail"))}
                    name="mainEmail"
                    description={parse(
                      this.translate("InitSetup.mainEmailDescription")
                    )}
                    value={this.state.mainEmail}
                    onChange={(e) =>
                      this.setState({ mainEmail: e.target.value })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.questions"))}
                    name="questions"
                    description={parse(
                      this.translate("InitSetup.questionsDescription")
                    )}
                    value={this.state.questions}
                    onChange={(e) =>
                      this.setState({ questions: e.target.value })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.termLink"))}
                    name="termLink"
                    description={parse(
                      this.translate("InitSetup.termLinkDescription")
                    )}
                    value={this.state.termLink}
                    onChange={(e) =>
                      this.setState({ termLink: e.target.value })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.technicalNotes"))}
                    name="technicalNotes"
                    description={parse(
                      this.translate("InitSetup.technicalNotesDescription")
                    )}
                    value={this.state.technicalNotes}
                    onChange={(e) =>
                      this.setState({
                        technicalNotes: e.target.value,
                      })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.questionsExample"))}
                    description={parse(
                      this.translate("InitSetup.questionsExampleDescription")
                    )}
                    name="questionsExample"
                    value={this.state.questionsExample}
                    onChange={(e) =>
                      this.setState({
                        questionsExample: e.target.value,
                      })
                    }
                  />
                  <Field
                    type="text"
                    label={parse(this.translate("InitSetup.feedbackExample"))}
                    description={parse(
                      this.translate("InitSetup.feedbackExampleDescription")
                    )}
                    name="feedbackExample"
                    value={this.state.feedbackExample}
                    onChange={(e) =>
                      this.setState({ feedbackExample: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button>{parse(this.translate("InitSetup.btnConfirm"))}</button>
          </form>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
          ariaHideApp={false}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>{parse(this.translate("InitSetupModal.title"))}</h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            <p>{parse(this.translate("InitSetupModal.description"))}</p>
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.showModal}
            >
              {parse(this.translate("InitSetupModal.btnCancel"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn, {
                "is-loading": this.state.isLoading,
              })}
              onClick={this.submitSetupData}
            >
              {parse(this.translate("InitSetupModal.btnConfirm"))}
            </button>
          </div>
        </ReactModal>
      </section>,
    ];
  }
}

export default injectIntl(InitSetup);
