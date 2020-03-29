import React from "react";

export default class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startedAt: this.getNow(),
      now: this.getNow(),
    };
  }

  getNow() {
    return Math.floor(new Date().getTime() / 1000);
  }

  componentDidMount() {
    this.tickHandle = window.setInterval(() => {
      this.setState({now: this.getNow()});
    }, 500);
    this.setState({now: this.getNow(), startedAt: this.getNow()});
  }

  componentWillUnmount() {
    window.clearInterval(this.tickHandle);
    delete this.tickHandle;
  }

  render() {
    const maxDots = 3;

    const count = 1 + (this.state.now - this.state.startedAt) % maxDots;
    const dots = ".".repeat(count);

    return <p>Loading{dots}</p>;
  }
}

