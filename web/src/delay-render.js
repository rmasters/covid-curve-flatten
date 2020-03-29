import React from "react";
import {CSSTransition} from 'react-transition-group';

/**
 * Delayed render mounts components after a delay, with a CSS fade-in transition
 * This is used to prevent rendering ~249 graphs at once.
 * In the future, it would be nice if it lazy-mounted as items enter the viewport.
 */
export default class DelayedRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  componentDidMount() {
    window.setTimeout(() => this.setState({visible: true}), this.props.wait);
  }

  render() {
    return (
      <CSSTransition in={this.state.visible} timeout={200} classNames="fadein" mountOnEnter={true}>
        {this.props.children}
      </CSSTransition>
    );
  }
}
