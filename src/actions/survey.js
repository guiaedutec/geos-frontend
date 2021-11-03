import moment from "moment";

let params = new URLSearchParams(document.location.search.substring(1));
let locale = params.get("lang") || process.env.DEFAULT_LOCALE;

export const SELECTED_SURVEY = "@@SELECTED_SURVEY";
export const SELECTED_ANSWER = "@@SELECTED_ANSWER";

export function setSelectedSurvey(survey) {
  localStorage.setItem(SELECTED_SURVEY, JSON.stringify(survey));
}

export function getSelectedSurvey() {
  return JSON.parse(localStorage.getItem(SELECTED_SURVEY));
}

export function setSelectedAnswer(survey) {
  localStorage.setItem(SELECTED_ANSWER, JSON.stringify(survey));
}

export function getSelectedAnswer() {
  return JSON.parse(localStorage.getItem(SELECTED_ANSWER));
}

export function removeSelectedSurvey() {
  return localStorage.removeItem(SELECTED_SURVEY);
}

export function surveyAnswered(survey, user) {
  if (user && user._id) return;
  var schedule = survey.schedule.length > 0 ? survey.schedule[0] : false;
  let userLocal = typeof user == "object" ? user._id.$oid : user;
  var ownerAnswers = schedule.answers.find(
    (answer) =>
      answer.user_id.$oid == userLocal &&
      answer.type != "Combined" &&
      answer.status == "Complete"
  );
  var isComplete = ownerAnswers ? true : false;
  var hasAnswered =
    schedule.answers.length > 0 &&
    isComplete &&
    !schedule.answers[0].old_response;
  if (schedule && hasAnswered) {
    if (schedule.is_cyclic) {
      if (!schedule.survey_start_date) {
        return hasAnswered;
      } else {
        if (survey.schedule.length <= 1) return true;
        else {
          let dateDBStart = moment(schedule.survey_start_date).toISOString();
          let dateDBEnd = moment(schedule.survey_end_date).toISOString();
          return moment(schedule.answers[0].submitted_at).isBetween(
            dateDBStart,
            dateDBEnd
          );
        }
      }
    } else {
      let dateDBSubmitted = moment(schedule.answers[0].submitted_at)
        .add(schedule.recurrence_days, "days")
        .toISOString();
      return moment().isBefore(dateDBSubmitted);
    }
  }
  return hasAnswered;
}

export function surveyStarted(survey, user) {
  var schedule = survey.schedule.length > 0 ? survey.schedule[0] : false;
  let answers = schedule.answers.filter(
    (answer) => answer.user_id.$oid == user._id.$oid
  );
  let started = answers.some(
    (answer) => answer.type != "Combined" && answer.status != "Complete"
  );
  return answers.length > 0 && started;
}

export function surveyOutPeriod(survey) {
  var schedule = survey.schedule.length > 0 ? survey.schedule[0] : false;
  if (schedule) {
    if (schedule.is_cyclic) {
      if (!schedule.survey_start_date) {
        return false;
      } else {
        let dateDBStart = moment(schedule.survey_start_date).toISOString();
        let dateDBEnd = moment(schedule.survey_end_date).toISOString();
        if (moment().isBetween(dateDBStart, dateDBEnd)) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (schedule.answers.length <= 0) {
        return false;
      } else {
        if (
          schedule.answers[schedule.answers.length - 1].submitted_at == null
        ) {
          return false;
        } else {
          let dateDBSubmitted = moment(schedule.answers[0].submitted_at)
            .add(schedule.recurrence_days, "days")
            .toISOString();
          return moment().isBefore(dateDBSubmitted);
        }
      }
    }
  }
}

export function surveyNextResponse(survey) {
  var schedule = survey.schedule.length > 0 ? survey.schedule[0] : false;
  moment.locale(locale);
  if (
    schedule.answers.length > 0 &&
    schedule.answers[schedule.answers.length - 1].status === "Complete" &&
    !schedule.answers[0].old_response
  )
    return moment(schedule.answers[0].submitted_at)
      .add(schedule.recurrence_days, "days")
      .format("LLLL");
  else return null;
}
