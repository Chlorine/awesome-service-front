import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../store/state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: AppState) => {
  return {
    router: state.router,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

declare type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

declare type State = {};

class NotFound extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <h3>
          <i className="fa fa-frown-o" /> 404
        </h3>
        <strong>{this.props.router.location.pathname}</strong>
        <br />
        Страница не найдена
        <br />
        <br />
        <Link to="/">На главную</Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
