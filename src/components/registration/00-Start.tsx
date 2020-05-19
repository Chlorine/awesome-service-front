import React from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

import { AppState } from '../../store/state';
import { Actions as EventInfoActions } from '../../actions/event-info';

import { PublicEventFullInfo } from '../../back/common/public-events';

import api from './../../back/server-api';
import { LocalStorageHelper } from '../../utils';
import { history } from '../../store';

declare type LSParamName = 'eventId';
const ls = new LocalStorageHelper<LSParamName>('tsVisitorReg');

const mapStateToProps = (state: AppState) => {
  return {
    eventInfo: state.eventInfo,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    eventInfoActions: bindActionCreators(EventInfoActions, dispatch),
  };
};

export type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation &
  RouteComponentProps<{ eventId?: string }>;

declare type State = {
  isWorking: boolean;
  errorMsg: string;
};

// tslint:disable-next-line:class-name
class Page00_Start extends React.Component<Props, State> {
  state: State = {
    isWorking: true,
    errorMsg: '',
  };

  componentDidMount(): void {
    this.setState({ isWorking: true, errorMsg: '' });

    let eventInfo: PublicEventFullInfo | undefined;

    this.loadEventInfo()
      .then(event => (eventInfo = event))
      .catch(err => this.setState({ errorMsg: err.message }))
      .then(() =>
        this.setState({ isWorking: false }, () => {
          if (eventInfo) {
            this.props.eventInfoActions.eventInfoLoaded(eventInfo);
          }
        }),
      );
  }

  loadEventInfo = async (): Promise<PublicEventFullInfo> => {
    let eventId: any = this.props.match.params.eventId;

    if (!eventId) {
      eventId = ls.get('eventId');
    }

    if (
      !eventId ||
      typeof eventId !== 'string' ||
      !/^([0-9a-fA-F]){24}$/.test(eventId)
    ) {
      // протеряли идентификатор мероприятия (не сможем зарегиться)
      throw new Error(
        `Для регистрации перейдите по ссылке от организаторов мероприятия`,
      );
    }

    const { event } = await api.events.exec('getEventFullInfo', {
      id: eventId,
      __delay: 200,
      __genErr: !'Некоторая ошибка загрузки',
    });

    ls.set('eventId', event.id);

    return event;
  };

  render() {
    const { isWorking, errorMsg } = this.state;
    const { t, eventInfo } = this.props;
    const { event } = eventInfo;

    return (
      <>
        {isWorking && (
          <>
            <Row>
              <Col>
                <h4>{t('page00.title')}</h4>
                <p className="text-muted">{t('page00.subTitle')}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Spinner animation="border" variant="secondary" />
              </Col>
            </Row>
          </>
        )}
        {!isWorking && errorMsg && (
          <Row>
            <Col className="d-flex flex-column align-items-center text-center">
              <div>
                <h3>
                  <i className="fa fa-frown-o text-danger" />{' '}
                  {t('common.failure.oops')}
                </h3>
              </div>
              <div>
                <p>{t('common.failure.somethingWrong')}</p>
              </div>
              <div>
                <small className="text-muted">{errorMsg}</small>
              </div>
            </Col>
          </Row>
        )}
        {!isWorking && !errorMsg && !!event && (
          <>
            <Row>
              <Col>
                <h4>{event.name}</h4>
                <p className="text-muted">{event.description}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button
                  variant="primary"
                  onClick={() => history.push(`/welcome/${event.id}`)}
                >
                  {t('common.buttons.register')}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Page00_Start),
);
