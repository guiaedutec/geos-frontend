import React from 'react';
// import FormData from 'react-form-data';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import Layout from '../../components/Layout';
import styles from './styles.styl';
import axios from 'axios';
import Body from '~/components/Body';
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import $ from 'jquery';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import {
    convertFromHTML,
    ContentState,
    EditorState,
    convertToRaw
} from 'draft-js';



import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from '~/api/utils';

import CONF from '~/api/index';

let getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};
import {
    compose
} from 'redux';

import APIDataContainer from '~/containers/api_data';
import NonUserRedir from '~/containers/non_user_redir';
import NonAdminStateCityRedir from '~/containers/non_admin_state_city_redir';


class DevolutivaCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fetchedDevolutive: false,
            devolutive:[],
            isEdit: false
        };
    }



    componentWillMount() {
        if(getQueryString('id') != null){
          this.getDevolutive();
        }else{
          this.setState({
            fetchedDevolutive: true
          })
        }
    }

    getDevolutive = () => {
        axios
        .get(CONF.ApiURL+'/api/v1/edit_feedback/'+ getQueryString('id') +'?access_token=' + getUserToken(), {})
        .then((devolutive) => {
            this.setState({
                fetchedDevolutive: true,
                devolutive: devolutive.data,
                isEdit: true
            })
        });
    }

    render() {
        return (
            <Layout pageHeader="Nova Página na Devolutiva">

              <Helmet title="Customizar Devolutiva"/>

              <Body>
                <section className="section">
                  <div className={classnames('container')}>
                      <div className={classnames(styles.section)}>
                          <div className="column">
                              <DevolutiveForm devolutive={this.state.devolutive} fetchedDevolutive={this.state.fetchedDevolutive} isEdit={this.state.isEdit} />
                          </div>
                      </div>
                  </div>
                </section>
              </Body>
            </Layout>
        );
    }
}

class DevolutiveForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            editorContents: [],
        };
    }



    onConvertToBody(body){

        if(this.props.isEdit){

            const contentBlocks = convertFromHTML(body);
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            this.state.editorContents[0] =  EditorState.createWithContent(contentState);

        }else{
            this.state.editorContents[0] = EditorState.createEmpty();


        }


    };

    onEditorStateChange(index, editorContent){

        let editorContents = this.state.editorContents;
        editorContents[index] = editorContent;
        editorContents = [...editorContents];
        this.state.editorContents[0] = editorContents[0]
    };

    remove(idDevolutive) {
      var result = confirm("Deseja remover este registro?");
      if (result) {
        axios.post(CONF.ApiURL+'/api/v1/delete_feedback',{
          access_token: getUserToken(),
          id: idDevolutive
        })
        .then(function (response) {
          if (response.data) {
            window.location = "/listar-devolutiva";
          }
        })
        .catch(function (error) {
          console.log('Delete devolutive fail '+error);
        });
      }
    }

    handleSubmit(e) {

        e.preventDefault();
        if($('#txt').val().length != 0 && $('#title').val().length != 0 && $('#subtitle').val().length != 0) {

            e = e || window.event;
            e = e.target || e.srcElement;

            const formArray = document.getElementById('formData');
            var arrFields = {};
            for (var i = 0; i < formArray.length; i++){
              if(formArray[i]['name']) {
                arrFields[formArray[i]['name']] = formArray[i]['value'];
              }
            }
            let feedback = JSON.stringify(arrFields);
            let json = JSON.parse(feedback)
                json['body'] = draftToHtml(convertToRaw(this.state.editorContents[0].getCurrentContent()))
                feedback = JSON.stringify(json)
            axios({
                method: 'post',
                url: CONF.ApiURL + '/api/v1/save_feedback?access_token=' + getUserToken(),
                data: {feedback}
            })
            .then((response) => {window.location = "/listar-devolutiva"})
            .catch(function (error) {
                console.log(error)
            })
        } else {
          alert('Todos os campos são obrigatórios')
        }
    }

    render() {

      var body = ''
      for(var key in this.props.devolutive.body) {
        if(this.props.devolutive.body.hasOwnProperty(key)) {
            body = body + this.props.devolutive.body[key] + '\n'

        }
      }
      this.onConvertToBody(body)
      const { editorContents } = this.state;
      return(

        (this.props.fetchedDevolutive) ?

          <form onSubmit={this.handleSubmit.bind(this)} id='formData'>
            {(this.props.isEdit) && <input type='hidden' name='id' value={this.props.devolutive._id.$oid} />}
            <Field label="Título da página" id="title" name="title" defaultValue={(this.props.isEdit)?this.props.devolutive.title:''} />
            <Field label="Subtítulo da página" id="subtitle" name="subtitle" defaultValue={(this.props.isEdit)?this.props.devolutive.subtitle:''} />
            <p className={styles.color_gray}>Conteúdo</p>
            <Editor
                id="wysiwys"
                hashtag={{}}
                defaultEditorState={editorContents[0]}
                toolbarClassName="demo-toolbar-custom"
                wrapperClassName="demo-wrapper-wide"
                editorClassName={classnames('demo-editor-custom', styles.editor)}
                onEditorStateChange={this.onEditorStateChange.bind(this, 0)}
                className={styles.editor}
                toolbar={{
                    options: [ 'textAlign', 'inline','colorPicker','history', 'remove',],
                    inline: { inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']},
                    list: { inDropdown: false },
                    textAlign: { inDropdown: false },
                    link: { inDropdown: false },
                    history: { inDropdown: false },
                }}

            />
              <input type='hidden' name="body" id='txt'  value={draftToHtml(convertToRaw(this.state.editorContents[0].getCurrentContent())).toString()} />

            <p className={styles.color_red}>Tecle <strong>'ENTER'</strong> sempre que quiser inserir um novo parágrafo.</p>

            <div className={styles.field}>
                <p className={classnames('control', styles.form__submit_button)}>
                    <SubmitBtn className={classnames('is-primary')}>
                        SALVAR
                    </SubmitBtn>
                </p>
            </div>

            {(this.props.isEdit && this.props.devolutive.feedback_id === null) &&
              <div className={styles.field}>
                <p className={styles.remove}>
                  <a href="#" className={styles.remove} onClick={() => this.remove(this.props.devolutive._id.$oid)}>
                    <i className="fa fa-times"/> Remover
                  </a>
                </p>
              </div>
            }
          </form>
          : <div><p className={styles.devolutive__title}><i>[problema ao carregar devolutiva cadastrada]</i></p></div>
      );
    }
}
export default compose(
    APIDataContainer,
    NonUserRedir,
    NonAdminStateCityRedir
)(DevolutivaCustom);
