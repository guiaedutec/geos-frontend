import React from "react";
import {connect} from 'react-redux';
import {change, reduxForm} from "redux-form";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import schema from "./schema";
import _ from "lodash";
import classnames from "classnames";
import styles from "../../region.styl";
import {SubmissionError} from 'redux-form'
import API from '~/api';
import {compose} from 'redux';

import APIDataContainer from '~/containers/api_data';

var getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

var formatRejectErrors = (response) => {
    let rej_errors = {};
    Object.keys(response).forEach(function (key) {
        //alert('key -> '+key);
        rej_errors[key] = response[key];
    });

    return rej_errors
}

class RegionForm extends React.Component {

    _updateSelectedState(event) {
        this.props.fields.state_id.onChange(event);

        setTimeout(() => {
            alert(JSON.stringify(this.props.fields.state_id.value));
            this.props.fetchStateCitiesById({
                state_id: this.props.fields.state_id.value
            });
        }, 0);
    }

    _updateSelectedCity(event) {
        this.props.fields.city_id.onChange(event);
    }

    _updateSelectedType(event){
        this.props.fields.state.onChange(event);
    }

    _submit(values) {

        if (values._id) {
            //update
            return new Promise((resolve, reject) => {
                API.Regions.updateManaged({
                    _id: values._id ? values._id : '',
                    name: values.name ? values.name : '',
                    region: values.region ? values.region : '',
                }).then(
                    (response) => {
                        if (response._id) {
                            alert('registro atualizado ' + response._id.$oid);
                            window.location = "/listar-tecnicos";
                            resolve();
                        }
                        else {
                            reject(formatRejectErrors(response));
                        }
                    }, (err) => {
                        reject({_error: 'Desculpe, Não foi possível atualizar as informações no servidor'})
                    }
                )
            })
        } else {
            //create
            return new Promise((resolve, reject) => {
                //alert(values.state);
                API.Regions.createManaged({
                    name: values.name ? values.name : '',
                    region: values.region ? values.region : ''
                }).then(
                    (response) => {
                        alert(JSON.stringify(response))
                        if (response._id) {
                            alert('registro criado ' + response._id.$oid);
                            window.location = "/listar-regioes";
                            resolve();
                        } else {
                            reject(formatRejectErrors(response));
                        }
                    }, (err) => {
                        reject({_error: 'Desculpe, Não foi possível cadastrar as informações no servidor'})
                    }
                )
            })
        }
    }

    componentWillMount() {
        this.props.fetchStates();
        this.loadData();
    }

    loadData() {
        var idParam = getQueryString('id');
        if (idParam) {
            //fill form with row to be updated
            API.Regions.findManaged(idParam).then(
                (regionFound) => {
                    if (region._id) {
                        console.log(regionFound);
                        this.props.fields.name.onChange(regionFound.name);
                        this.props.fields.region.onChange(regionFound.region);
                    }
                }
            )
        }
    }

    handleChange(event) {
        // Call the event supplied by redux-form.
        this.props.onChange(event)
        console.log('handlechange');
    }

    render() {
        const {
            fields,
            handleSubmit,
            submitting,
            error,
        } = this.props;

        const onSubmit = handleSubmit(this._submit.bind(this));
        return (
            <form className={styles.form} onSubmit={onSubmit}>

                {error && <strong>{error}</strong>}

                <input type="hidden" {...fields._id}/>
                <Field label="Nome" {...fields.name}/>

                <div className={styles.field}>
                    <label className="label Field_field__label_2FT">Estado</label>
                    <span className={classnames('select', styles.form__select)}>
                      <select {...fields.state_id} onChange={this._updateSelectedState.bind(this)}>
                        <option value="">Selecione seu estado</option>
                          {this.props.apiData.states.map(state => (
                              <option key={state.acronym} value={state._id.$oid}>
                                  {state.name}
                              </option>
                          ))}
                      </select>
                    </span>
                </div>

                <div className={styles.field}>
                    <p className={classnames('control', styles.form__submit_button)}>
                        <SubmitBtn className={classnames('is-primary', {
                            'is-loading': submitting,
                        })}>
                            CADASTRAR
                        </SubmitBtn>
                    </p>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'regionForm',
    fields: _.keys(schema),
    initialValues: {},
})(compose(
    APIDataContainer,
)(RegionForm));
