import React from 'react';
import axios from 'axios';
import styles from '../index.styl';
import CONF from '~/api/index';

export default class States extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      token: "x9Vv8iNzDXHytfirpaWH",
      theadQ: [],
      theadR: [],
      allAnswers: null,
      states: [
        { id: "57db41f857f3170003d9f704", acronym: "AC", name: "Acre" },
        { id: "57db41f857f3170003d9f705", acronym: "AL", name: "Alagoas" },
        { id: "57db41f857f3170003d9f706", acronym: "AM", name: "Amazonas" },
        { id: "57db41f857f3170003d9f707", acronym: "AP", name: "Amapá" },
        { id: "57db41f857f3170003d9f708", acronym: "BA", name: "Bahia" },
        { id: "57db41f857f3170003d9f709", acronym: "CE", name: "Ceará" },
        { id: "57db41f857f3170003d9f70a", acronym: "DF", name: "Distrito Federal" },
        { id: "57db41f957f3170003d9f70b", acronym: "ES", name: "Espírito Santo" },
        { id: "57db41f957f3170003d9f70c", acronym: "GO", name: "Goiás" },
        { id: "57db41f957f3170003d9f70d", acronym: "MA", name: "Maranhão" },
        { id: "57db41f957f3170003d9f70e", acronym: "MG", name: "Minas Gerais" },
        { id: "57db41f957f3170003d9f70f", acronym: "MS", name: "Mato Grosso do Sul" },
        { id: "57db41f957f3170003d9f710", acronym: "MT", name: "Mato Grosso" },
        { id: "57db41f957f3170003d9f711", acronym: "PA", name: "Pará" },
        { id: "57db41f957f3170003d9f712", acronym: "PB", name: "Paraíba" },
        { id: "57db41f957f3170003d9f713", acronym: "PE", name: "Pernambuco" },
        { id: "57db41f957f3170003d9f714", acronym: "PI", name: "Piauí" },
        { id: "57db41f957f3170003d9f715", acronym: "PR", name: "Paraná" },
        { id: "57db41f957f3170003d9f716", acronym: "RJ", name: "Rio de Janeiro" },
        { id: "57db41f957f3170003d9f717", acronym: "RN", name: "Rio Grande do Norte" },
        { id: "57db41f957f3170003d9f718", acronym: "RO", name: "Rondônia" },
        { id: "57db41f957f3170003d9f719", acronym: "RR", name: "Roraima" },
        { id: "57db41f957f3170003d9f71a", acronym: "RS", name: "Rio Grande do Sul" },
        { id: "57db41f957f3170003d9f71b", acronym: "SC", name: "Santa Catarina" },
        { id: "57db41f957f3170003d9f71c", acronym: "SE", name: "Sergipe" },
        { id: "57db41f957f3170003d9f71d", acronym: "SP", name: "São Paulo" },
        { id: "57db41f957f3170003d9f71e", acronym: "TO", name: "Tocantins" }
      ]
    };
  }

  componentDidMount() {
    this.state.loading = true;
    var allAnswers = [];
    this.getStateData(true, allAnswers, this.state.states[0]);
  }

  getStateData(isFirst, allAnswers, state){
    axios
      .get(CONF.ApiURL + '/api/v1/survey_answers_results.json?access_token='+ this.state.token + '&state_id=' + state.id + '&network=Estadual')
      .then(res => {
        var surAnsRes = res.data;
        var samplePercent = surAnsRes.total_sample == 0 ? 0 : ((surAnsRes.answered_sample * 100) / surAnsRes.total_sample);
        var countPercent = surAnsRes.total_count == 0 ? 0 : ((surAnsRes.answered_count * 100) / surAnsRes.total_count);
        var isSample = countPercent < 85 ? true : false;
        var isIrrelevantData = samplePercent < 85 && isSample ? true : false;
        var valueReference = isSample ? surAnsRes.answered_sample : surAnsRes.answered_count;

        axios
          .get(CONF.ApiURL + '/api/v1/result_questions_per_dimension?access_token='+ this.state.token + '&state_id=' + state.id + '&network=Estadual&type=' + (isSample ? '2' : '1'))
          .then(res => {
            var an = res.data.pop();
            var infraD = res.data.pop();
            var isInfraD = false;

            // Header
            if(isFirst){
              isFirst = false;
              var theadQ = an.map((a) => {
                if(a.result != undefined){
                  return <th colSpan={a.result.length}>{a.question.replace(/<u>/g, '').replace(/<\/u>/g, '')}</th>;
                } else {
                  if(!isInfraD){
                    isInfraD = true;
                    return <th colSpan={6}>{a.question.replace(/<u>/g, '').replace(/<\/u>/g, '')}</th>;
                  }
                }
              });
              theadQ.splice(0,0,<th rowSpan={2}>Estado</th>, <th rowSpan={2}>{isIrrelevantData ? "*" : ""}É amostra?</th>, <th rowSpan={2}>Total</th>);
              theadQ.splice(3,0,<th colSpan="4">Média</th>);
              this.setState({ theadQ });

              var level = 0;
              const theadR = an.map((a) => {
                if(a.result != undefined){
                  return a.result.map((r) => <th>{r.option_text.replace(/<u>/g, '').replace(/<\/u>/g, '')}</th>);
                } else {
                  level++;
                  return <th>Nível {level}</th>
                }
              });
              theadR.splice(0,0, <th>Visão</th>, <th>Competência / Formação</th>, <th>Recrusos Educaionais Digitais</th>, <th>Infraestrutura</th>);
              this.setState({ theadR });
            }

            var level = 0;
            const answers = an.map((a) => {
              if(a.result != undefined){
                return a.result.map((r) => <td>{Math.round((r.count / valueReference) * 100)}</td>);
              } else {
                level++;
                switch (level) {
                  case 1:
                    return <td>{infraD[0].level1}</td>;
                  case 2:
                    return <td>{infraD[0].level2}</td>;
                  case 3:
                    return <td>{infraD[0].level3}</td>;
                  case 4:
                    return <td>{infraD[0].level4}</td>;
                  case 5:
                    return <td>{infraD[0].level5}</td>;
                  case 6:
                    return <td>{infraD[0].level6}</td>;
                }
              }
            });

            axios
              .get(CONF.ApiURL + '/api/v1/survey_result_avg?access_token='+ this.state.token + '&state_id=' + state.id + '&network=Estadual&type=' + (isSample ? '2' : '1'))
              .then(res => {
                console.log(res.data);
                let avgs = res.data[0];

                answers.splice(0,0, <th>{state.name} - {state.acronym}</th>, <th>{isSample ? "SIM" : "NÃO"}</th>, <th>{valueReference}</th>);
                answers.splice(3,0, <th>{avgs.vision_avg.toFixed(1)}</th>, <th>{avgs.competence_avg.toFixed(1)}</th>, <th>{avgs.crd_avg.toFixed(1)}</th>, <th>{avgs.infra_avg.toFixed(1)}</th>);
                allAnswers.push(<tr>{answers}</tr>);
                this.setState({ allAnswers });

                if(this.state.allAnswers.length < this.state.states.length) {
                  var nextIdx = this.state.states.indexOf(state) + 1;
                  this.getStateData(false, allAnswers, this.state.states[nextIdx]);
                }
              })
              .catch(err => {
                console.log(err);
              });


          })
          .catch(err => {
            allAnswers.push(<tr><th className={styles.error}>{state.name}</th></tr>);
            if(this.state.allAnswers.length < this.state.states.length) {
              var nextIdx = this.state.states.indexOf(state) + 1;
              this.getStateData(false, allAnswers, this.state.states[nextIdx]);
            }
          });
      });
  }

  render() {
    if(this.state.allAnswers && this.state.allAnswers.length == this.state.states.length){
      this.state.loading = false;
    }

    return (
      <div>

        { this.state.loading ? <div className={styles.loading}><i className="fas fa-circle-notch fa-spin"></i></div> : "" }
        <table className="table" style={{overflowX:'scroll'}}>
          <thead>
            <tr>
              { this.state.theadQ }
            </tr>
            <tr>
              { this.state.theadR }
            </tr>
          </thead>
          <tbody>
            { this.state.allAnswers }
          </tbody>
        </table>

      </div>
    )
  }
}
