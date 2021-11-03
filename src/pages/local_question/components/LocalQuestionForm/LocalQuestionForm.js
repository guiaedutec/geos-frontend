import React from "react";
import styles from "../../styles.styl";

class LocalQuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.appendCheck = this.appendCheck.bind(this);
    this.appendRadio = this.appendRadio.bind(this);
    this.state = {
      inputCheck: [],
      inputRadio: [],
    };
  }

  render() {
    return (
      <form className={styles.form}>
        <Field label="Pergunta 1" name="question1" />

        {this.state.inputCheck.map((input, inputIndex) => (
          <div onDrop={this.drop}>
            <input type="checkbox" key={inputIndex} />
            &nbsp;Fundamental 1
          </div>
        ))}
        <button onClick={this.appendCheck.bind(this)}>
          Resposta Multipla Escolha
        </button>

        {this.state.inputRadio.map((input) => (
          <div onDrop={this.drop}>
            <input type="radio" key={this.state.inputRadio.length} />
            &nbsp;Entre 60 e 79
          </div>
        ))}
        <button onClick={this.appendRadio.bind(this)}>
          Resposta Única Escolha
        </button>
      </form>
    );
  }

  appendCheck(e) {
    e.preventDefault();

    var newCheck = `input-${this.state.inputCheck.length}`;
    this.setState({ inputCheck: this.state.inputCheck.concat([newCheck]) });
  }

  appendRadio(e) {
    e.preventDefault();

    var newRadio = `input-${this.state.inputRadio.length}`;
    this.setState({ inputRadio: this.state.inputRadio.concat([newRadio]) });
  }

  deleteElement(e) {
    var taskIndex = parseInt(e.target.value, 10);
    console.log("remove element: %d", taskIndex, this.state.items[taskIndex]);
    this.setState((state) => {
      state.items.splice(taskIndex, 1);
      return { items: state.items };
    });
  }
}

export default LocalQuestionForm();
