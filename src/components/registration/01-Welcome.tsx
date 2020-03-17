import React from 'react';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';

import VisitorRegForm from './VisitorRegForm';

import { MinimalVisitorInfo } from '../../common-interfaces/common-front';
import { Col, Row } from 'react-bootstrap';

import { WithTranslation, withTranslation } from 'react-i18next';
import { Utils } from '../../utils';
import { isVisitorInfoStateNotEmpty } from '../../store/visitor-info-state';

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
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

declare type State = {};

// tslint:disable-next-line:class-name
class Page01_Welcome extends React.Component<Props, State> {
  state: State = {};

  componentDidMount(): void {
    const { visitorInfo, visitorInfoActions } = this.props;

    if (!isVisitorInfoStateNotEmpty(visitorInfo)) {
      // у нас пустой (чистый) visitor

      setTimeout(() => visitorInfoActions.loadFromLocalStorage(), 333);
    }
  }

  onSubmitRegForm = async (visitor: MinimalVisitorInfo) => {
    await Utils.delay(50);
    this.props.visitorInfoActions.baseInfoSubmitted(visitor);
  };

  render() {
    const { t, visitorInfo, auth } = this.props;

    return (
      <>
        <Row>
          <Col>
            <h4>{t('page01.title')}</h4>
            <p className="text-muted">{t('page01.subTitle')}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <VisitorRegForm
              handleSubmit={this.onSubmitRegForm}
              initialValues={visitorInfo.baseInfo}
              debugMode={auth.debugMode}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Page01_Welcome),
);
