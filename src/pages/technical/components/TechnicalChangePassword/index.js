import React, { Component } from "react";
import classnames from "classnames";

export default class TecnicalChangePassword extends Component {
  constructor(props) {
    super(props);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  state = {
    password: "",
  };

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSave(this.state.password);
  };

  render() {
    return (
      <div
        className={classnames("modal", {
          "is-active": true,
        })}
      >
        <div className={"modal-background"}></div>
        <div className={"modal-card"}>
          <header className={"modal-card-head"}>
            <p className="modal-card-title">Alterar senha</p>
            <button
              onClick={this.props.onClose}
              className="delete"
              aria-label="close"
            ></button>
          </header>
          <section className="modal-card-body">
            <p>
              Você está alterando a senha do(a) usuário chamado(a){" "}
              <b>{this.props.user.name}</b>
            </p>
            <br />
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    placeholder="Digite a nova senha..."
                    value={this.state.password}
                    onChange={this.handleChangePassword}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button
              onClick={this.handleSubmit}
              className={`button is-success ${
                this.props.loading ? "is-loading" : null
              } `}
            >
              Salvar
            </button>
            <button onClick={this.props.onClose} className="button">
              Cancelar
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
