// import React from "react";
// import Helmet from "react-helmet";
// import classnames from "classnames";
// import FieldTextArea from "~/components/Form/FieldTextArea";
// import Field from "~/components/Form/Field";
// import SubmitBtn from "~/components/SubmitBtn";
// import Layout from "../../components/Layout";
// import Button from "../../components/Button";
// import UserRedir from "~/containers/user_redir";
// import axios from "axios";
// import styles from "./spreadsheet.styl";
// import update from "react-addons-update";
// const ReactDataGrid = require("react-data-grid");
// const {
//   // DraggableHeader: { DraggableContainer },
// } = require("react-data-grid-addons");
// var createReactClass = require("create-react-class");

// import { compose } from "redux";

// import {
//   getUserToken,
//   setUserToken,
//   removeUserToken,
//   createUrlWithParams,
// } from "~/api/utils";

// import CONF from "~/api/index";
// import APIDataContainer from "~/containers/api_data";
// import NonUserRedir from "~/containers/non_user_redir";
// import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";
// var createReactClass = require("create-react-class");

// class SpreadsheetManager extends React.Component {
//   render() {
//     return (
//       <Layout
//         className={styles.layout}
//         pageHeader="Importação de Planilha de Contatos"
//       >
//         <Helmet title="Importação de Planilha de Contatos" />

//         <div className={classnames("container")}>
//           <div className={classnames("section columns", styles.section)}>
//             <div className="column is-half">
//               <TableSpreadsheet />
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }
// }

// const TableSpreadsheet = createReactClass({
//   // getInitialState() {
//   //   return {
//   //     msg: "CADASTRAR",
//   //     setting_valid: false,
//   //     fields_render : [
//   //       "Nome do diretor",
//   //       "Email",
//   //       "Telefone"
//   //     ],
//   //     sizeFileExcecd: false,
//   //
//   //     columns: [],
//   //     excelHasNoRows: false,
//   //     errorsTableBody: [
//   //     ],
//   //     rows: this.createRows()
//   //   };
//   // },
//   getInitialState() {
//     return {
//       columns: [
//         {
//           key: "name",
//           name: "Nome do contato",
//           width: 250,
//           draggable: true,
//           resizable: true,
//         },
//         {
//           key: "email",
//           name: "Email",
//           width: 250,
//           draggable: true,
//           resizable: true,
//         },
//         {
//           key: "phone",
//           name: "Telefone",
//           width: 250,
//           draggable: true,
//           resizable: true,
//         },
//       ],
//       //rows: this.createRows()
//       rows: this.upload_file,
//     };
//   },

//   createRows(...newRow) {
//     let rows = [];
//     console.log(newRow);

//     for (let i = 1; i < 10; i++) {
//       rows.push({
//         name: "Contato " + i,
//         email: "contato " + i + "@eamil.com",
//         phone: (i + 3) * 321,
//       });
//     }

//     console.log("rows");
//     console.log(rows);

//     return rows;
//   },

//   rowGetter(i) {
//     return this.state.rows[i];
//   },

//   onHeaderDrop: function (source, target) {
//     const stateCopy = Object.assign({}, this.state);
//     const columnSourceIndex = this.state.columns.findIndex(
//       (i) => i.key === source
//     );
//     const columnTargetIndex = this.state.columns.findIndex(
//       (i) => i.key === target
//     );

//     stateCopy.columns.splice(
//       columnTargetIndex,
//       0,
//       stateCopy.columns.splice(columnSourceIndex, 1)[0]
//     );

//     const emptyColumns = Object.assign({}, this.state, { columns: [] });
//     this.setState(emptyColumns);

//     const reorderedColumns = Object.assign({}, this.state, {
//       columns: stateCopy.columns,
//     });
//     this.setState(reorderedColumns);

//     // var arrayList = [];
//     // if (reorderedColumns.columns.length > 0) {
//     //     for (var j =0; j < this.state.rows.length ; j++) {
//     //         var obj = new Object();
//     //         for (var i =0; i < reorderedColumns.columns.length ; i++) {
//     //             obj[i] = this.state.rows[j][reorderedColumns.columns[i].key];
//     //         }
//     //         arrayList.push(obj);
//     //         console.log("//******************************************//");
//     //         console.log(obj);
//     //     }
//     // }
//     //   this.setState({
//     //     rows: arrayList
//     //   });
//   },

//   upload_file: function (e) {
//     this.createRows("teste 1", "teste 2", "teste 3");
//     const _this = this;
//     this.setState({
//       excelHasNoRows: false,
//       msg: "CADASTRAR",
//       errorsTableBody: [],
//       setting_valid: false,
//     });
//     var data = new FormData();

//     var this_object = this;

//     var fileSize = document.getElementById("file").files[0].size;
//     var aFileSize = fileSize / 1048576;
//     if (aFileSize < 20) {
//       this.setState({
//         sizeFileExcecd: false,
//       });

//       console.log("*******<<<<<<>>>>>>*******");

//       data.append("file", document.getElementById("file").files[0]);

//       axios
//         .post(
//           CONF.ApiURL +
//             "/api/v1/render_stepone_upload_manager?access_token=" +
//             getUserToken(),
//           data
//         )
//         .then(function (response) {
//           if (response.data && response.data.length > 0) {
//             //     //content
//             //     const qtd_required_columns = 3;
//             //     var new_fields_render = this_object.state.fields_render;
//             //     let size_generate = qtd_required_columns;
//             //     let data_columns_generate = response.data[0];
//             console.log("response.data.length > 0");
//             //     if(data_columns_generate.length < qtd_required_columns) {
//             //       let plus_gen = size_generate - data_columns_generate.length;
//             //       for(let i=0; i< plus_gen; i++) {
//             //         response.data[0].push('');
//             //       }
//           } else if (data_columns_generate.length > qtd_required_columns) {
//             //       let plus_gen = data_columns_generate.length - size_generate;
//             //       for(let i=0; i< plus_gen; i++) {
//             //         new_fields_render.push('[não utilizado]');
//             //       }
//             console.log("data_columns_generate.length > qtd_required_columns");
//           }
//           //     let new_columns = []
//           //     for(let i=0; i<response.data[0].length; i++) {
//           //       let val = response.data[0][i] ? response.data[0][i] : '[vazio]'
//           //       new_columns[i] = {
//           //         key: i,
//           //         name: '< ' + val + ' >',
//           //         width: 120,
//           //         draggable: true,
//           //         editable: true
//           //       }
//           //     }
//           //
//           //     let new_rows = []
//           //     for(let i=1; i<response.data.length; i++) {
//           //       let new_row = {}
//           //       for (let y=0; y<response.data[i].length; y++) {
//           //         new_row[y] = response.data[i][y];
//           //       }
//           //
//           //       new_rows.push(new_row);
//           //     }
//           //
//           //     this_object.setState(
//           //       {
//           //         columns: new_columns,
//           //         rows: new_rows,
//           //         fields_render: new_fields_render
//           //       }
//           //     );
//           //   } else {
//           //       _this.setState({excelHasNoRows: true});
//           //   }
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//     } else {
//       this.setState({
//         sizeFileExcecd: true,
//         columns: ([] = 0),
//       });
//     }
//   },
//   //   //******************************************//
//   //   handleGridRowsUpdated({ fromRow, toRow, updated }) {
//   //     this.setState({
//   //         msg: 'CADASTRAR',
//   //     })
//   //     let rows = this.state.rows.slice();
//   //
//   //     for (let i = fromRow; i <= toRow; i++) {
//   //       let rowToUpdate = rows[i];
//   //       let updatedRow = update(rowToUpdate, {$merge: updated});
//   //       rows[i] = updatedRow;
//   //     }
//   //
//   //     this.setState({ rows });
//   //   },
//   // //**************************************************//
//   //   save: function(e) {
//   //     const _this = this;
//   //     _this.setState({setting_valid: true});
//   //     var obj = new Object();
//   //
//   //     var arrayList = [];
//   //     if (this.state.rows) {
//   //       for (var i = 0; i< this.state.rows.length; i++) {
//   //         var array = [];
//   //         Object.keys(this.state.rows[i]).forEach(function(key,index) {
//   //             array.push(_this.state.rows[i][key]);
//   //         });
//   //           arrayList.push(array);
//   //       }
//   //     }
//   //     obj.xls = arrayList;
//   //
//   //     axios.post(CONF.ApiURL + '/api/v1/upload_spread_scheets_manager/?access_token=' + getUserToken(), obj)
//   //       .then(function (response) {
//   //         if (response.data && response.data.length > 0) {
//   //             _this.setState({
//   //                 errorsTableBody: response.data,
//   //                 msg: 'Falha ao salvar',
//   //                 setting_valid: false
//   //             })
//   //         } else {
//   //             _this.setState({
//   //                 errorsTableBody: response.data,
//   //                 msg: 'Salvo com sucesso',
//   //                 setting_valid: false
//   //             })
//   //         }
//   //       })
//   //       .catch(function (error) {
//   //           _this.setState({
//   //               msg: 'Falha ao salvar',
//   //               setting_valid: false
//   //           })
//   //      });
//   //   },

//   // render() {
//   //
//   //   return (
//   //
//   //   <div className={styles.form}>
//   //     <h1 className={styles.highlighted}>Informe o excel contendo a relação de diretores a ser importada:</h1>
//   //     <br/><input type="file" id="file" onChange={this.upload_file} accept=".xls,.xlsx" />
//   //     {this.state.sizeFileExcecd == true ?
//   //       <div> Passou de 20 megas </div>
//   //     : null}
//   //     {this.state.columns.length > 0 ?
//   //       <div>
//   //         <br/>
//   //         <br/>
//   //         <br/>
//   //         <div className={styles.container_header_spreadsheet}>
//   //           <h1 className={styles.highlighted}>Revise as informações obtidas do seu excel: <br/>Mova as colunas de acordo com as informações esperadas. Você também pode alterar as células.</h1>
//   //           <br/>
//   //           <div className={styles.container_spreadsheet}>
//   //             <div className={styles.container_header_top_spreadsheet}>
//   //               <div id="header_0" className={styles.header_table_header_first_element_spreadsheet}>
//   //               </div>
//   //               {this.state.fields_render.map( (title, titleIndex) =>
//   //                 <div id={'header_'+ titleIndex} className={styles.header_table_header_element_spreadsheet}>
//   //                   {title}<br/><i className="fa fa-long-arrow-down"/>
//   //                 </div>
//   //               )}
//   //             </div>
//   //             <DraggableContainer
//   //               onHeaderDrop={this.onHeaderDrop}>
//   //               <ReactDataGrid
//   //                 enableCellSelect={true}
//   //                 onGridRowsUpdated={this.handleGridRowsUpdated}
//   //                 columns={this.state.columns}
//   //                 rowGetter={this.rowGetter}
//   //                 rowsCount={this.state.rows.length}
//   //                 colsCount={12}
//   //                 minHeight={200}
//   //                 minWidth={this.state.fields_render.length * 121.5}
//   //                 styles="overflow-x: hidden"
//   //               />
//   //             </DraggableContainer>
//   //           </div>
//   //         </div>
//   //         <div className={styles.field}>
//   //           <p className={classnames('control', styles.form__submit_button)}>
//   //             <SubmitBtn onClick={this.save} className={classnames('is-primary',{'is-loading': this.state && this.state.setting_valid ? true : false,})}>
//   //               {this.state.msg}
//   //             </SubmitBtn>
//   //           </p>
//   //         </div>
//   //       </div>
//   //     : null
//   //   }
//   //     {this.state.errorsTableBody.length > 0 ?
//   //       <div>
//   //         <table className={classnames('table')}>
//   //           <thead>
//   //             <th>Linha</th>
//   //             <th>Erro</th>
//   //           </thead>
//   //           <tbody>
//   //             {this.state.errorsTableBody.map( (item, inputIndex) =>
//   //               <tr>
//   //                 <td>{item.line}</td>
//   //                 <td>
//   //                 {item.t_error.map( (it, inputIndex) =>
//   //                   <div>{it}</div>
//   //                 )}
//   //                 </td>
//   //               </tr>
//   //             )}
//   //           </tbody>
//   //         </table>
//   //       </div>
//   //     : null}
//   //     {this.state.excelHasNoRows == true ?
//   //       <div> Não possui registros </div>
//   //     : null}
//   //   </div>
//   //   );
//   // }
//   //});

//   render() {
//     return (
//       <div className={styles.form}>
//         <h1 className={styles.highlighted}>
//           Informe o excel contendo a relação de contatos a ser importada:
//         </h1>
//         <br />
//         <input
//           type="file"
//           id="file"
//           onChange={this.upload_file}
//           accept=".xls,.xlsx"
//         />
//         <div>
//           <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
//             {/* <ReactDataGrid
//               columns={this.state.columns}
//               rowGetter={this.rowGetter}
//               rowsCount={this.state.rows.length}
//               minWidth={750}
//               minHeight={400}
//             /> */}
//           </DraggableContainer>
//         </div>
//       </div>
//     );
//   },
// });

// export default compose(
//   APIDataContainer,
//   NonUserRedir,
//   NonAdminStateCityRedir
// )(SpreadsheetManager);
