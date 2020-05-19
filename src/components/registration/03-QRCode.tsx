import React from 'react';
import { Button, Col, Row, Spinner, Card } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import vCardFactory from 'vcards-js';
import Measure, { ContentRect } from 'react-measure';
import { Redirect, RouteComponentProps } from 'react-router';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';

import { history } from '../../store';

import TS_LOGO from './../../images/ts_334.png';

import api from '../../back/server-api';

import StartOverConfirmModal from './StartOverConfirmModal';
import { WithTranslation, withTranslation } from 'react-i18next';
import { PhoneCountries } from '../../common-interfaces/phone-numbers';
import { isVisitorInfoStateNotEmpty } from '../../store/visitor-info-state';

const mapStateToProps = (state: AppState) => {
  return {
    visitorInfo: state.visitorInfo,
    auth: state.auth,
    eventInfo: state.eventInfo,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    visitorInfoActions: bindActionCreators(VisitorInfoActions, dispatch),
  };
};

declare type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation &
  RouteComponentProps<{ eventId?: string }>;

declare type State = {
  isWorking: boolean;
  errorMsg: string;
  qrCodeValue: string;
  qrPlaceholderWidth: number;
  startOverModalVisible: boolean;
};

class Page03_QRCode extends React.Component<Props, State> {
  state: State = {
    isWorking: false,
    errorMsg: '',
    qrCodeValue: '',
    qrPlaceholderWidth: 0,
    startOverModalVisible: false,
  };

  componentDidMount(): void {
    const { visitorInfo } = this.props;

    if (isVisitorInfoStateNotEmpty(visitorInfo)) {
      this.getQRCode().catch(err => console.error);
    }
  }

  getQRCode = async () => {
    const { visitorInfo } = this.props;

    this.setState({ isWorking: true, errorMsg: '', qrCodeValue: '' });

    try {
      const { baseInfo, phone, phoneCountry, email } = visitorInfo;
      const {
        lastName,
        firstName,
        middleName,
        companyName,
        position,
      } = baseInfo;

      let visitorPhone = '';

      if (phone) {
        visitorPhone = `${PhoneCountries[phoneCountry].prefix}${phone}`;
      }

      const { visitor } = await api.events.exec('registerEventVisitor', {
        sourceType: 'fast-track',
        eventId: this.props.eventInfo.event!.id,
        visitor: {
          lastName,
          firstName,
          middleName,
          companyName,
          position,
          phone,
          email,
        },

        __delay: 100,
        __genErr: !'Не удалось сделать хорошую мину при плохой игре',
      });

      console.log(`visitorId: ${visitor.id}`);

      const vCard = vCardFactory();

      vCard.firstName = baseInfo.firstName;
      vCard.middleName = baseInfo.middleName;
      vCard.lastName = baseInfo.lastName;

      vCard.organization = baseInfo.companyName;
      vCard.title = baseInfo.position;

      if (phone) {
        vCard.cellPhone = visitorPhone;
      }

      if (email) {
        vCard.workEmail = email;
      }

      vCard.version = '3.0';

      let vCardData = vCard.getFormattedString();

      // let vCardData = vCard.getFormattedString().replace(/;CHARSET=UTF-8/g, '');

      console.log(vCardData);

      this.setState({ qrCodeValue: vCardData });
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }

    this.setState({ isWorking: false });
  };

  onQRPlaceholderResize = (contentRect: ContentRect) => {
    // console.log(contentRect);
    const { bounds } = contentRect;
    if (bounds) {
      this.setState({ qrPlaceholderWidth: bounds.right - bounds.left });
    }
  };

  handleStartOverModalClose = (confirmed: boolean) => {
    this.setState({ startOverModalVisible: false }, () => {
      if (confirmed) {
        history.push(this.goToStartUrl);
      }
    });
  };

  get goToStartUrl(): string {
    const eventId = this.props.match.params.eventId;
    return eventId ? `/start/${eventId}` : '/start';
  }

  render() {
    const {
      isWorking,
      errorMsg,
      qrCodeValue,
      qrPlaceholderWidth,
      startOverModalVisible,
    } = this.state;

    const { t, visitorInfo } = this.props;

    if (!isVisitorInfoStateNotEmpty(visitorInfo)) {
      return <Redirect to={this.goToStartUrl} />;
    }

    return (
      <>
        <StartOverConfirmModal
          visible={startOverModalVisible}
          handleClose={this.handleStartOverModalClose}
        />
        {isWorking && (
          <Row>
            <Col className="d-flex flex-column align-items-center">
              <Spinner animation="border" variant="secondary" />
              <div className="mt-3">{t('common.messages.pleaseWait')}</div>
            </Col>
          </Row>
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
              <div className="pt-5">
                <Button variant="secondary" onClick={this.getQRCode}>
                  {t('common.failure.btnRetryCaption')}
                </Button>
              </div>
            </Col>
          </Row>
        )}
        {!isWorking && !errorMsg && qrCodeValue && (
          <>
            <Row>
              <Col>
                <h4>{t('page03.title')}</h4>

                <p className="text-muted">{t('page03.subTitle')}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Measure bounds={true} onResize={this.onQRPlaceholderResize}>
                    {({ measureRef }) => (
                      <div
                        ref={measureRef}
                        style={{ padding: 2 }}
                        className="shadow"
                      >
                        {qrPlaceholderWidth > 4 && (
                          <QRCode
                            value={qrCodeValue}
                            size={qrPlaceholderWidth - 4}
                            bgColor={'#ffffff'}
                            fgColor={'#000000'}
                            includeMargin={true}
                            level={'Q'}
                            renderAs={'svg'}
                            imageSettings={{
                              excavate: true,
                              src: TS_LOGO,
                              width: 100,
                              height: 39,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </Measure>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({ startOverModalVisible: true })}
                >
                  {t('common.buttons.startOver')}
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
  connect(mapStateToProps, mapDispatchToProps)(Page03_QRCode),
);
