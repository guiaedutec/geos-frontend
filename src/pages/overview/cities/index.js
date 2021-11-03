import React from 'react';
import axios from 'axios';
import styles from '../index.styl';
import CONF from '~/api/index';

export default class Cities extends React.Component {
  state = {
    loading: false,
    isFirst: true,
    page: 1,
    token: "x9Vv8iNzDXHytfirpaWH",
    theadQ: [],
    theadR: [],
    allAnswers: [],
    cities: []
  }

  componentDidMount() {
    this.state.loading = true;
    this.getCityInfo(this.state.page);
  }

  getCityInfo(){
    axios
      .post(CONF.ApiURL + '/api/v1/retrieve_dashboard?access_token=' + this.state.token, {
        "state": "",
        "city": "",
        "network_type": "Municipal",
        "page": this.state.page
      })
      .then(res => {
        var cities = res.data;

        if(cities.length > 0){
          this.setState({ cities });
          this.getCityData(cities[0], cities);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCityData(city, cities){
    city.id = city.city_id["$oid"];
    var samplePercent = parseFloat(city.cicle_one.toFixed(1));
    var countPercent = parseFloat(city.cicle_two.toFixed(1));
    var isCount = countPercent >= 85 ? true : false;
    var isSample = samplePercent >= 85 && !isCount ? true : false;
    var isIrrelevantData = samplePercent < 85 && isSample ? true : false;

    if(isSample || isCount){
      var valueReference = isSample ? city.answered_sample_count : city.answered_count;
      axios
        .get(CONF.ApiURL + '/api/v1/result_questions_per_dimension?access_token='+ this.state.token + '&city_id=' + city.id + '&network=Municipal&type=' + (isSample ? '2' : '1'))
        .then(res => {
          var an = res.data.pop();
          var infraD = res.data.pop();
          var isInfraD = false;

          // Header
          if(this.state.isFirst){
            this.state.isFirst = false;
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
            theadQ.splice(0,0,<th rowSpan={2}>Cidade/Estado</th>, <th rowSpan={2}>{isIrrelevantData ? "*" : ""}É amostra?</th>, <th rowSpan={2}>Total</th>);
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
              if(a.page < 7){
                return a.result.map((r) => <td>{Math.round((r.count / valueReference) * 100)}</td>);
              }
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
            .get(CONF.ApiURL + '/api/v1/survey_result_avg?access_token='+ this.state.token + '&city_id=' + city.id + '&network=Municipal&type=' + (isSample ? '2' : '1'))
            .then(res => {
              let avgs = res.data[0];

              answers.splice(0,0, <th>{city.city_name}/{city.state_name}</th>, <th>{isSample ? "SIM" : "NÃO"}</th>, <th>{valueReference}</th>);
              answers.splice(3,0, <th>{avgs.vision_avg.toFixed(1)}</th>, <th>{avgs.competence_avg.toFixed(1)}</th>, <th>{avgs.crd_avg.toFixed(1)}</th>, <th>{avgs.infra_avg.toFixed(1)}</th>);
              this.state.allAnswers.push(<tr>{answers}</tr>);
              var allAnswers = this.state.allAnswers;
              this.setState({ allAnswers });

              if(cities.indexOf(city) < this.state.cities.length - 1) {
                console.log(city.id);
                var nextIdx = cities.indexOf(city) + 1;
                this.getCityData(cities[nextIdx], cities);
              }
            })
            .catch(err => {
              console.log("Chamada survey_result_avg: ", err);
            });
        })
        .catch(err => {
          console.log("Chamada result_questions_per_dimension: ", err);
          this.state.allAnswers.push(<tr><th className={styles.error}>{city.city_name}</th></tr>);
          if(cities.indexOf(city) < this.state.cities.length - 1) {
            var nextIdx = cities.indexOf(city) + 1;
            this.getCityData(cities[nextIdx], cities);
          }
        });
    }
    else{
      if(cities.indexOf(city) < this.state.cities.length - 1){
        var nextIdx = cities.indexOf(city) + 1;
        this.getCityData(cities[nextIdx], cities);
      }
    }

    if(cities.indexOf(city) == this.state.cities.length - 1){
      console.log(cities.indexOf(city) == this.state.cities.length - 1, this.state.page);
      this.state.page += 1;
      console.log(this.state.page);
      this.getCityInfo();
    }
  }

  render() {
    this.state.loading = false;

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
