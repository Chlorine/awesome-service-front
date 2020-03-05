import React from 'react';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';

import { VisitorRegForm } from './VisitorRegForm';
import { MinimalVisitorInfo } from '../../common-interfaces/common-front';
import { Col, Row } from 'react-bootstrap';

const mapStateToProps = (state: AppState) => {
  return {
    visitorInfo: state.visitorInfo,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    visitorInfoActions: bindActionCreators(VisitorInfoActions, dispatch),
  };
};

declare type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

declare type State = {};

class Page01_Welcome extends React.Component<Props, State> {
  state: State = {};

  onSubmitRegForm = async (visitor: MinimalVisitorInfo) => {
    this.props.visitorInfoActions.baseInfoSubmitted(visitor);
  };

  render() {
    const { visitorInfo } = this.props;

    return (
      <>
        <Row>
          <Col>
            <h4>Добро пожаловать!</h4>

            <p className="text-muted">Введите данные для печати бэйджа</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <VisitorRegForm
              handleSubmit={this.onSubmitRegForm}
              initialValues={visitorInfo.baseInfo}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page01_Welcome);
