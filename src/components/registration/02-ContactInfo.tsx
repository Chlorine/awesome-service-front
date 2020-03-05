import React from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { history } from '../../store';
import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';
import { ContactInfoForm } from './ContactInfoForm';
import ContactInfoExplainModal from './ContactInfoExplainModal';

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
  explainModalVisible: boolean;
};

class Page02_ContactInfo extends React.Component<Props, State> {
  state: State = {
    explainModalVisible: false,
  };

  onBtnPrev = () => {
    history.goBack();
  };

  componentDidMount(): void {}

  onBtnNext = async (email: string, phone: string): Promise<void> => {
    this.props.visitorInfoActions.contactInfoSubmitted(email, phone);
  };

  handleRadioChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    this.props.visitorInfoActions.shareContactsRadioChanged(
      ev.currentTarget.value === 'YES',
    );
  };

  render() {
    const { explainModalVisible } = this.state;
    const { visitorInfo } = this.props;
    const { email, phone, wantsToShareContacts } = visitorInfo;

    return (
      <>
        <ContactInfoExplainModal
          visible={explainModalVisible}
          handleClose={() => this.setState({ explainModalVisible: false })}
        />
        <Row>
          <Col>
            <h4>Отлично!</h4>

            <p className="text-muted">Последний вопрос:</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Хотите разместить на бейдже{' '}
              <span className="text-nowrap">QR-код</span> с вашим телефоном и
              адресом email?
            </p>

            <p>
              <button
                className="link-button link-like"
                onClick={() => this.setState({ explainModalVisible: true })}
              >
                Зачем мне это?
              </button>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <fieldset>
                <Row>
                  <Col>
                    <Form.Check
                      type="radio"
                      inline
                      label="Нет, спасибо"
                      name="formRadioNO"
                      id="formRadioNO"
                      value="NO"
                      checked={!wantsToShareContacts}
                      onChange={this.handleRadioChange}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Form.Check
                      type="radio"
                      inline
                      label="Да, хочу"
                      name="formRadioYES"
                      id="formRadioYES"
                      value="YES"
                      checked={wantsToShareContacts}
                      onChange={this.handleRadioChange}
                    />
                  </Col>
                </Row>
              </fieldset>
            </Form>
          </Col>
        </Row>
        {wantsToShareContacts && (
          <Row className="pt-3">
            <Col>
              <ContactInfoForm
                handleSubmit={this.onBtnNext}
                handleGoBack={this.onBtnPrev}
                initialValues={{ email, phone }}
              />
            </Col>
          </Row>
        )}
        {!wantsToShareContacts && (
          <Row className="pt-5">
            <Col>
              <Button variant="secondary" onClick={this.onBtnPrev}>
                Назад
              </Button>
              <Button
                className="ml-2"
                variant="primary"
                onClick={() =>
                  this.props.visitorInfoActions.contactInfoSubmitted('', '')
                }
              >
                Продолжить
              </Button>
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page02_ContactInfo);
