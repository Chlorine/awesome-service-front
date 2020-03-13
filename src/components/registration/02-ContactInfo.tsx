import React from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';

import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Redirect } from 'react-router';

import { history } from '../../store';
import { AppState } from '../../store/state';
import { Actions as VisitorInfoActions } from '../../actions/visitor-info';
import ContactInfoForm from './ContactInfoForm';
import ContactInfoExplainModal from './ContactInfoExplainModal';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  DefaultPhoneCountry,
  PhoneCountry,
} from '../../common-interfaces/phone-numbers';
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

  onBtnNext = async (
    email: string,
    phone: string,
    phoneCountry: PhoneCountry,
  ): Promise<void> => {
    console.log(phoneCountry);
    this.props.visitorInfoActions.contactInfoSubmitted(
      email,
      phone,
      phoneCountry,
    );
  };

  handleRadioChange = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    this.props.visitorInfoActions.shareContactsRadioChanged(
      ev.currentTarget.value === 'YES',
    );
  };

  render() {
    const { explainModalVisible } = this.state;
    const { visitorInfo, t } = this.props;
    const { email, phone, phoneCountry, wantsToShareContacts } = visitorInfo;

    if (!isVisitorInfoStateNotEmpty(visitorInfo)) {
      return <Redirect to={'/welcome'} />;
    }

    return (
      <>
        <ContactInfoExplainModal
          visible={explainModalVisible}
          handleClose={() => this.setState({ explainModalVisible: false })}
        />
        <Row>
          <Col>
            <h4>{t('page02.title')}</h4>

            <p className="text-muted">{t('page02.subTitle')}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{t('page02.questionText')}</p>

            <p>
              <button
                className="link-button link-like"
                onClick={() => this.setState({ explainModalVisible: true })}
              >
                {t('page02.btnForWhatCaption')}
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
                      label={t('page02.radioNoCaption')}
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
                      label={t('page02.radioYesCaption')}
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
                initialValues={{ email, phone, phoneCountry }}
              />
            </Col>
          </Row>
        )}
        {!wantsToShareContacts && (
          <Row className="pt-5">
            <Col>
              <Button variant="outline-secondary" onClick={this.onBtnPrev}>
                {t('common.buttons.back')}
              </Button>
              <Button
                className="ml-2"
                variant="primary"
                onClick={() =>
                  this.props.visitorInfoActions.contactInfoSubmitted(
                    '',
                    '',
                    DefaultPhoneCountry,
                  )
                }
              >
                {t('common.buttons.finish')}
              </Button>
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Page02_ContactInfo),
);
