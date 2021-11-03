import React from "react";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import { compose } from "redux";
import FieldSimpleSelect from "~/components/Form/FieldSimpleSelect";
import APIDataContainer from "~/containers/api_data";
import { getKnowledges, getStages } from "~/helpers/data_const";

export class ProfessionalFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stagesOptions: getStages(props) || [],
      knowledgesOptions: [],
    };
    this.onChangeTeachingStage = this.onChangeTeachingStage.bind(this);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  onChangeTeachingStage(e) {
    if (e.target.value === "") {
      this.setState({ knowledgesOptions: [] });
      return;
    }
    const knowledgesOptions = getKnowledges(this.props);
    const options = knowledgesOptions.find((option) =>
      option.label === e.target.value
        ? option.label === e.target.value
        : e.target.value.indexOf(option.label) !== -1 &&
          e.target.value.split(" ")[0] === option.label
    ).options;
    this.setState({ knowledgesOptions: options });
  }

  render() {
    return (
      <div className="columns">
        <div className="column">
          <FieldSimpleSelect
            onChangeTeachingStage={this.onChangeTeachingStage}
            name="teaching_stage"
            label={this.translate("SignUpForm.label.teachingStages")}
            options={this.state.stagesOptions}
            emptyOptionText={this.translate("SignUpForm.placeholderStages")}
            hiddenMargin
          />
        </div>
        <div className="column">
          <FieldSimpleSelect
            name="knowledge"
            label={this.translate("SignUpForm.label.knowledges")}
            options={this.state.knowledgesOptions}
            emptyOptionText={this.translate("SignUpForm.placeholderKnowledges")}
            hiddenMargin
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(compose(APIDataContainer)(ProfessionalFilters));
