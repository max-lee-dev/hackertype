import React from "react";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  state = {
    background: "#fff",
  };

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };

  render() {
    return <SketchPicker color={this.state.background} onChangeComplete={this.handleChangeComplete} />;
  }
}
