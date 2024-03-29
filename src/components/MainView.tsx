import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line
import { Dispatch, bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { Button, Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import classNames from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

import { AppState } from '../store/state';
// eslint-disable-next-line
import { history } from '../store';

import { WSHelper } from '../server-ws';

// import api from '../back/server-api';

import './MainView.scss';
import { CurrentBreakpoint } from './common';
import { Utils } from '../utils';
import ShareLinkModal from './common/ShareLinkModal';
import { Actions as AuthActions } from '../actions/auth';

const mapStateToProps = (state: AppState) => {
  return {
    auth: state.auth,
    router: state.router,
    eventInfo: state.eventInfo,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

declare type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

declare type State = {
  wsConnected: boolean;
  language: 'ru' | 'en';
  shareLinkModalVisible: boolean;
};

const flipLang = (lang: State['language']): State['language'] => {
  return lang === 'en' ? 'ru' : 'en';
};

class MainView extends React.Component<Props, State> {
  wsHelper = new WSHelper();

  state: State = {
    wsConnected: false,
    language: 'ru',
    shareLinkModalVisible: false,
  };

  componentDidMount() {
    const { i18n } = this.props;

    this.setState({ language: flipLang(flipLang(i18n.language as any)) });

    this.wsHelper.onConnStateChanged = connected => {
      this.setState({ wsConnected: connected });

      // this.props.infoEventsActions.newEventReceived({
      //   type: connected ? 'success' : 'error',
      //   source: 'WebSocket',
      //   message: `Соединение ${connected ? 'установлено' : 'разорвано'}`,
      // });
    };

    this.wsHelper.subscribeTo('infoEvent', ({ event }) => {
      //this.props.infoEventsActions.newEventReceived(event),
    });

    /////////////////////

    this.testServerApi()
      .then(() => console.log('testServerApi finished'))
      .catch(err => console.error(`testServerApi failed ${err}`));

    //////////////////////
  }

  async testServerApi() {
    try {
      // let res1 = await _serverApi.executeRequest({ action: 'doSomethingElse' });
      // await api.core.exec('doSomethingElse', { incomingToken: 'vvv4' });
      // await _serverApi.exec('users', 'requestPasswordReset', {});
      // console.log('testServerApi: done');
    } catch (err) {
      console.error(`CATCH in testServerApi: ${err}`);
    }
  }

  componentWillUnmount() {
    this.wsHelper.onBeforeUnmount();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    if (this.props.auth.user !== prevProps.auth.user) {
      if (this.props.auth.user) {
        this.wsHelper.ws.connect();
      } else {
        this.wsHelper.ws.disconnect();
      }
    }
  }

  renderTopMenu() {
    const { auth } = this.props;
    // eslint-disable-next-line
    const { user, uiSettings } = auth;

    if (user) {
      return (
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav
            className="mr-auto"
            activeKey={this.props.router.location.pathname}
          >
            {/* Home: всякое про нас сервис и базу */}

            <LinkContainer to={'/home'}>
              <Nav.Link eventKey={'1'}>Home</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      );
    }
  }

  renderFooter() {
    const { t, eventInfo } = this.props;

    return (
      <footer className="ts-nice-footer py-1 fixed-bottom">
        <Container fluid={true}>
          <Row>
            <Col className="d-flex flex-row align-content-center justify-content-between">
              <div style={{ lineHeight: '110%' }}>
                <small>
                  &copy; {t('common.ticketSoft')} 2020{' '}
                  <a
                    href="http://www.soft.ru"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.soft.ru
                  </a>
                </small>
              </div>
              {!!eventInfo.event && (
                <div style={{ lineHeight: '110%' }}>
                  <small>
                    <button
                      className="link-button link-like"
                      onClick={() =>
                        this.setState({ shareLinkModalVisible: true })
                      }
                    >
                      <i className="fa fa-share" />
                    </button>
                  </small>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }

  toggleLanguage = (ev: React.SyntheticEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    console.log(`toggleLanguage (curr: ${this.state.language})`);

    this.setLanguage(flipLang(this.state.language));
  };

  private setLanguage(lang: State['language']) {
    const { i18n } = this.props;

    i18n
      .changeLanguage(lang)
      .then(() => {
        this.setState({ language: lang });
        Utils.localStorageSet('language', lang);
      })
      .catch(console.error);
  }

  render() {
    const { language, shareLinkModalVisible } = this.state;
    const { t, eventInfo } = this.props;

    let brandLinkUrl = '/';
    if (eventInfo.event) {
      brandLinkUrl = `/start/${eventInfo.event.id}`;
    }

    const searchPrefix = '?redirectTo=';
    const { location } = this.props.router;

    //// для подкладной морды
    if (
      location &&
      location.pathname === '/' &&
      location.search &&
      location.search.startsWith(searchPrefix)
    ) {
      return <Redirect to={location.search.substring(searchPrefix.length)} />;
    }
    ////

    return (
      <div className="d-flex flex-column">
        <header>
          <Navbar
            bg="light"
            expand="sm"
            fixed={'top'}
            collapseOnSelect={true}
            className="border-bottom pt-1 pb-1"
          >
            <LinkContainer exact to={brandLinkUrl}>
              <Navbar.Brand>
                <span className="text-info mr-1">
                  <i className="fa fa-id-badge" />
                </span>

                <span className="d-md-inline">
                  {' '}
                  {t('common.pageTitle', 'Регистрялово')}{' '}
                  <span className="text-danger">
                    <CurrentBreakpoint invisible={true} />
                  </span>{' '}
                </span>
              </Navbar.Brand>
            </LinkContainer>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Button
                  variant="secondary"
                  className="secondary-light pl-1 pr-1 pt-1 pb-1"
                  onClick={this.toggleLanguage}
                >
                  <span className="mr-1 text-uppercase">
                    {flipLang(language).toUpperCase()}
                  </span>
                  <span
                    className={classNames('flag-icon', {
                      'flag-icon-ru': language === 'en',
                      'flag-icon-gb': language === 'ru',
                    })}
                  />
                </Button>
              </li>
            </ul>
          </Navbar>
        </header>
        {/* ---- */}
        <main className="ts-nice-main flex-fill">
          <ShareLinkModal
            visible={shareLinkModalVisible}
            eventId={eventInfo.event?.id}
            handleClose={() => this.setState({ shareLinkModalVisible: false })}
            handleEnableDebugMode={() => {
              if (!this.props.auth.debugMode) {
                console.log('debug mode enabled :)');
                this.props.authActions.enableDebugMode();
              }
            }}
          />
          <Container fluid={true} className="mt-3 mb-3">
            {this.props.children}
          </Container>
        </main>
        {/* ---- */}
        {this.renderFooter()}
      </div>
    );
  }
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(MainView),
);
