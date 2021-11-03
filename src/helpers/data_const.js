import React from "react";
import { FormattedMessage } from "react-intl";

export function getStages(props) {
  return [
    {
      key: "kindergarten",
      value: props.intl.formatMessage({ id: "DataConst.kindergarten" }),
      label: props.intl.formatMessage({ id: "DataConst.kindergarten" }),
    },
    {
      key: "elementarySchool1",
      value: props.intl.formatMessage({ id: "DataConst.elementarySchool1" }),
      label: props.intl.formatMessage({ id: "DataConst.elementarySchool1" }),
    },
    {
      key: "elementarySchool2",
      value: props.intl.formatMessage({ id: "DataConst.elementarySchool2" }),
      label: props.intl.formatMessage({ id: "DataConst.elementarySchool2" }),
    },
    {
      key: "highSchool",
      value: props.intl.formatMessage({ id: "DataConst.highSchool" }),
      label: props.intl.formatMessage({ id: "DataConst.highSchool" }),
    },
    {
      key: "eja",
      value: props.intl.formatMessage({ id: "DataConst.eja" }),
      label: props.intl.formatMessage({ id: "DataConst.eja" }),
    },
    {
      key: "technicalEducation",
      value: props.intl.formatMessage({ id: "DataConst.technicalEducation" }),
      label: props.intl.formatMessage({ id: "DataConst.technicalEducation" }),
    },
    {
      key: "higherEducation",
      value: props.intl.formatMessage({ id: "DataConst.higherEducation" }),
      label: props.intl.formatMessage({ id: "DataConst.higherEducation" }),
    },
  ];
}

export function getKnowledges(props) {
  return [
    {
      key: "kindergarten",
      label: props.intl.formatMessage({ id: "DataConst.kindergarten" }),
      options: [
        {
          key: "kindergarten.experienceFields",
          value: props.intl.formatMessage({ id: "DataConst.experienceFields" }),
          label: props.intl.formatMessage({ id: "DataConst.experienceFields" }),
        },
      ],
    },
    {
      key: "elementarySchool",
      label: props.intl.formatMessage({ id: "DataConst.elementarySchool" }),
      options: [
        {
          key: "elementarySchool.portuguese",
          value: props.intl.formatMessage({ id: "DataConst.portuguese" }),
          label: props.intl.formatMessage({ id: "DataConst.portuguese" }),
        },
        {
          key: "elementarySchool.art",
          value: props.intl.formatMessage({ id: "DataConst.art" }),
          label: props.intl.formatMessage({ id: "DataConst.art" }),
        },
        {
          key: "elementarySchool.pe",
          value: props.intl.formatMessage({ id: "DataConst.pe" }),
          label: props.intl.formatMessage({ id: "DataConst.pe" }),
        },
        {
          key: "elementarySchool.english",
          value: props.intl.formatMessage({ id: "DataConst.english" }),
          label: props.intl.formatMessage({ id: "DataConst.english" }),
        },
        {
          key: "elementarySchool.spanish",
          value: props.intl.formatMessage({ id: "DataConst.spanish" }),
          label: props.intl.formatMessage({ id: "DataConst.spanish" }),
        },
        {
          key: "elementarySchool.math",
          value: props.intl.formatMessage({ id: "DataConst.math" }),
          label: props.intl.formatMessage({ id: "DataConst.math" }),
        },
        {
          key: "elementarySchool.science",
          value: props.intl.formatMessage({ id: "DataConst.science" }),
          label: props.intl.formatMessage({ id: "DataConst.science" }),
        },
        {
          key: "elementarySchool.geo",
          value: props.intl.formatMessage({ id: "DataConst.geo" }),
          label: props.intl.formatMessage({ id: "DataConst.geo" }),
        },
        {
          key: "elementarySchool.history",
          value: props.intl.formatMessage({ id: "DataConst.history" }),
          label: props.intl.formatMessage({ id: "DataConst.history" }),
        },
        {
          key: "elementarySchool.religion",
          value: props.intl.formatMessage({ id: "DataConst.religion" }),
          label: props.intl.formatMessage({ id: "DataConst.religion" }),
        },
        {
          key: "elementarySchool.polyvalent",
          value: props.intl.formatMessage({ id: "DataConst.polyvalent" }),
          label: props.intl.formatMessage({ id: "DataConst.polyvalent" }),
        },
      ],
    },
    {
      key: "highSchool",
      label: props.intl.formatMessage({ id: "DataConst.highSchool" }),
      options: [
        {
          key: "highSchool.languagesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.languagesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.languagesAndTechnologies",
          }),
        },
        {
          key: "highSchool.mathAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.mathAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.mathAndTechnologies",
          }),
        },
        {
          key: "highSchool.naturalSciencesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.naturalSciencesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.naturalSciencesAndTechnologies",
          }),
        },
        {
          key: "highSchool.humanSciencesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.humanSciencesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.humanSciencesAndTechnologies",
          }),
        },
      ],
    },
    {
      key: "eja",
      label: props.intl.formatMessage({ id: "DataConst.eja" }),
      options: [
        {
          key: "eja.humanSciencesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.portuguese",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.portuguese",
          }),
        },
        {
          key: "eja.art",
          value: props.intl.formatMessage({
            id: "DataConst.art",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.art",
          }),
        },
        {
          key: "eja.pe",
          value: props.intl.formatMessage({
            id: "DataConst.pe",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.pe",
          }),
        },
        {
          key: "eja.english",
          value: props.intl.formatMessage({
            id: "DataConst.english",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.english",
          }),
        },
        {
          key: "eja.spanish",
          value: props.intl.formatMessage({
            id: "DataConst.spanish",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.spanish",
          }),
        },
        {
          key: "eja.math",
          value: props.intl.formatMessage({
            id: "DataConst.math",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.math",
          }),
        },
        {
          key: "eja.science",
          value: props.intl.formatMessage({
            id: "DataConst.science",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.science",
          }),
        },
        {
          key: "eja.geo",
          value: props.intl.formatMessage({
            id: "DataConst.geo",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.geo",
          }),
        },
        {
          key: "eja.history",
          value: props.intl.formatMessage({
            id: "DataConst.history",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.history",
          }),
        },
        {
          key: "eja.religion",
          value: props.intl.formatMessage({
            id: "DataConst.religion",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.religion",
          }),
        },
        {
          key: "eja.languagesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.languagesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.languagesAndTechnologies",
          }),
        },
        {
          key: "eja.mathAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.mathAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.mathAndTechnologies",
          }),
        },
        {
          key: "eja.naturalSciencesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.naturalSciencesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.naturalSciencesAndTechnologies",
          }),
        },
        {
          key: "eja.humanSciencesAndTechnologies",
          value: props.intl.formatMessage({
            id: "DataConst.humanSciencesAndTechnologies",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.humanSciencesAndTechnologies",
          }),
        },
      ],
    },
    {
      key: "technicalEducation",
      label: props.intl.formatMessage({ id: "DataConst.technicalEducation" }),
      options: [
        {
          key: "technicalEducation.technicalEducation",
          value: props.intl.formatMessage({
            id: "DataConst.technicalEducation",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.technicalEducation",
          }),
        },
      ],
    },
    {
      key: "higherEducation",
      label: props.intl.formatMessage({ id: "DataConst.higherEducation" }),
      options: [
        {
          key: "higherEducation.biologicalSciences",
          value: props.intl.formatMessage({
            id: "DataConst.biologicalSciences",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.biologicalSciences",
          }),
        },
        {
          key: "higherEducation.engineering",
          value: props.intl.formatMessage({
            id: "DataConst.engineering",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.engineering",
          }),
        },
        {
          key: "higherEducation.healthScience",
          value: props.intl.formatMessage({
            id: "DataConst.healthScience",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.healthScience",
          }),
        },
        {
          key: "higherEducation.exactAndEarthSciences",
          value: props.intl.formatMessage({
            id: "DataConst.exactAndEarthSciences",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.exactAndEarthSciences",
          }),
        },
        {
          key: "higherEducation.appliedSocialSciences",
          value: props.intl.formatMessage({
            id: "DataConst.appliedSocialSciences",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.appliedSocialSciences",
          }),
        },
        {
          key: "higherEducation.humanities",
          value: props.intl.formatMessage({
            id: "DataConst.humanities",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.humanities",
          }),
        },
        {
          key: "higherEducation.linguisticsLettersAndArts",
          value: props.intl.formatMessage({
            id: "DataConst.linguisticsLettersAndArts",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.linguisticsLettersAndArts",
          }),
        },
        {
          key: "higherEducation.agrarianSciences",
          value: props.intl.formatMessage({
            id: "DataConst.agrarianSciences",
          }),
          label: props.intl.formatMessage({
            id: "DataConst.agrarianSciences",
          }),
        },
      ],
    },
  ];
}

export function getFormation(props) {
  return [
    {
      value: props.intl.formatMessage({
        id: "DataConst.continuingEducationInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.continuingEducationInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.continuingEducationCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.continuingEducationCompleted",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.graduationInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.graduationInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.graduationCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.graduationCompleted",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.specializationInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.specializationInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.specializationCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.specializationCompleted",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.masterInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.masterInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.masterCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.masterCompleted",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.phdInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.phdInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.phdInCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.phdInCompleted",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.postDoctorateInProgress",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.postDoctorateInProgress",
      }),
      isDisabled: false,
    },
    {
      value: props.intl.formatMessage({
        id: "DataConst.postDoctorateInCompleted",
      }),
      label: props.intl.formatMessage({
        id: "DataConst.postDoctorateInCompleted",
      }),
      isDisabled: false,
    },
  ];
}

export function getEvaluationLevel() {
  return [
    {
      name: (
        <FormattedMessage id="DiagnosisTeacher.selfEvaluation.transformation" />
      ),
      idx: 5,
    },
    {
      name: (
        <FormattedMessage id="DiagnosisTeacher.selfEvaluation.integration" />
      ),
      idx: 4,
    },
    {
      name: (
        <FormattedMessage id="DiagnosisTeacher.selfEvaluation.adaptation" />
      ),
      idx: 3,
    },
    {
      name: (
        <FormattedMessage id="DiagnosisTeacher.selfEvaluation.familiarization" />
      ),
      idx: 2,
    },
    {
      name: <FormattedMessage id="DiagnosisTeacher.selfEvaluation.exposure" />,
      idx: 1,
    },
  ];
}
