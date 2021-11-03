import React from "react";
import PropTypes from "prop-types";
import AnswersFilterField from "./AnswersTableFilterField";
import { times } from "lodash";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

class AnswersTableFilterFieldsPanel extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const levels = times(4, (i) => ({
      value: i + 1,
      label: i + 1,
    }));
    return (
      <form className="column">
        <div className="columns">
          <AnswersFilterField
            name="sample"
            label={this.translate("FollowUp.samples")}
            onChange={this.props.handleSampleFilter}
            options={[
              { label: this.translate("FollowUp.yes"), value: true },
              { label: this.translate("FollowUp.no"), value: false },
            ]}
            isClearable
          />
          <AnswersFilterField
            name="answered"
            label={this.translate("FollowUp.answered")}
            onChange={this.props.handleAnsweredFilter}
            options={[
              { label: this.translate("FollowUp.yes"), value: true },
              { label: this.translate("FollowUp.no"), value: false },
            ]}
            isClearable
          />
          <AnswersFilterField
            name="vision_level"
            label={this.translate("FollowUp.visionLevel")}
            onChange={this.props.handleVisionLevelFilter}
            options={levels}
            isMulti
          />
          <AnswersFilterField
            name="competence_level"
            label={this.translate("FollowUp.competenceLevel")}
            onChange={this.props.handleCompetenceLevelFilter}
            options={levels}
            isMulti
          />
          <AnswersFilterField
            name="resource_level"
            label={this.translate("FollowUp.resourcesLevel")}
            onChange={this.props.handleResourcesLevelFilter}
            options={levels}
            isMulti
          />
          <AnswersFilterField
            name="infrastructure_level"
            label={this.translate("FollowUp.infrastructureLevel")}
            onChange={this.props.handleInfrastructureLevelFilter}
            options={levels}
            isMulti
          />
        </div>
      </form>
    );
  }
}

AnswersTableFilterFieldsPanel.propTypes = {
  fetchSurveyAnswers: PropTypes.func,
};

export default injectIntl(AnswersTableFilterFieldsPanel);
