import React from 'react';
import { Button, Col, Row, Spinner, Card } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import vCardFactory from 'vcards-js';
import Measure, { ContentRect } from 'react-measure';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';

import { history } from '../../store';

import TS_LOGO from './../../images/ts_334.png';

import serverApi from '../../server-api';
import StartOverConfirmModal from './StartOverConfirmModal';

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
    this.getQRCode().catch(err => console.error);
  }

  getQRCode = async () => {
    const { visitorInfo } = this.props;

    this.setState({ isWorking: true, errorMsg: '', qrCodeValue: '' });

    try {
      const { baseInfo, phone, email } = visitorInfo;

      const { visitorId } = await serverApi.execute('registerVisitor', {
        visitor: baseInfo,
        email,
        phone,
        __delay: 100,
        __genErr: false,
      });

      console.log(`visitorId: ${visitorId}`);

      const vCard = vCardFactory();

      // vCard.version = '3';

      // console.log(vCard.getMajorVersion());
      // console.log(JSON.stringify(vCard, null, 2));

      vCard.firstName = baseInfo.firstName;
      vCard.middleName = baseInfo.middleName;
      vCard.lastName = baseInfo.lastName;

      vCard.organization = baseInfo.companyName;
      vCard.title = baseInfo.position;

      if (phone) {
        vCard.cellPhone = phone;
      }

      if (email) {
        vCard.workEmail = email;
      }

      vCard.version = '3.0';

      // let vCardData = vCard.getFormattedString();

      let vCardData = vCard.getFormattedString().replace(/;CHARSET=UTF-8/g, '');

      console.log(vCardData);

      // const simpleString = `${baseInfo.firstName};${baseInfo.middleName};${baseInfo.lastName};${baseInfo.companyName};${baseInfo.position};${phone};${email}`;

      this.setState({ qrCodeValue: vCardData });
      // this.setState({ qrCodeValue: simpleString });
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
        history.push('/welcome');
      }
    });
  };

  render() {
    const {
      isWorking,
      errorMsg,
      qrCodeValue,
      qrPlaceholderWidth,
      startOverModalVisible,
    } = this.state;

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
              <div className="mt-3"> Пожалуйста, подождите...</div>
            </Col>
          </Row>
        )}
        {!isWorking && errorMsg && (
          <Row>
            <Col className="d-flex flex-column align-items-center text-center">
              <div>
                <h3>
                  <i className="fa fa-bug text-danger" /> Ой!
                </h3>
              </div>
              <div>
                <p>Что-то пошло не так</p>
              </div>
              <div>
                <small className="text-muted">{errorMsg}</small>
              </div>
              <div className="pt-5">
                <Button variant="secondary" onClick={this.getQRCode}>
                  Повторить запрос
                </Button>
              </div>
            </Col>
          </Row>
        )}
        {!isWorking && !errorMsg && qrCodeValue && (
          <>
            <Row>
              <Col>
                <h4>Готово!</h4>

                <p className="text-muted">
                  Сканируйте этот код на стойках автоматической печати бейджей
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Measure bounds={true} onResize={this.onQRPlaceholderResize}>
                    {({ measureRef }) => (
                      <div ref={measureRef} style={{ padding: 2 }}>
                        {qrPlaceholderWidth > 4 && (
                          <QRCode
                            value={qrCodeValue}
                            size={qrPlaceholderWidth - 4}
                            bgColor={'#ffffff'}
                            fgColor={'#000000'}
                            includeMargin={true}
                            level={'M'}
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
                  Начать сначала
                </Button>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page03_QRCode);
