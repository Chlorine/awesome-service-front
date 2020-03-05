import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line
import { Dispatch, bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
// eslint-disable-next-line
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { AppState } from '../store/state';
// eslint-disable-next-line
import { history } from '../store';

// eslint-disable-next-line
import serverApi, { ServerAPI } from '../server-api';
import { WSHelper } from '../server-ws';

import './MainView.scss';
import { CurrentBreakpoint } from './common';

const mapStateToProps = (state: AppState) => {
  return {
    auth: state.auth,
    router: state.router,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

declare type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

declare type State = {
  wsConnected: boolean;
};

class MainView extends React.Component<Props, State> {
  wsHelper = new WSHelper();

  state: State = {
    wsConnected: false,
  };

  componentDidMount() {
    this.wsHelper.onConnStateChanged = connected => {
      this.setState({ wsConnected: connected });

      // this.props.infoEventsActions.newEventReceived({
      //   type: connected ? 'success' : 'error',
      //   source: 'WebSocket',
      //   message: `Соединение ${connected ? 'установлено' : 'разорвано'}`,
      // });
    };

    // this.wsHelper.subscribeTo('infoEvent', ({ event }) =>
    //   // this.props.infoEventsActions.newEventReceived(event),
    // );
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
    // const { auth } = this.props;
    return (
      <footer className="tscontr-footer py-1 fixed-bottom">
        <Container fluid={true}>
          <div style={{ lineHeight: '110%' }}>
            <small>
              &copy; Тикет Софт 2020{' '}
              <a
                href="http://www.soft.ru"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.soft.ru
              </a>
            </small>
          </div>
        </Container>
      </footer>
    );
  }

  render() {
    // eslint-disable-next-line
    const { wsConnected } = this.state;

    const searchPrefix = '?redirectTo=';
    const { location } = this.props.router;

    if (
      location &&
      location.pathname === '/' &&
      location.search &&
      location.search.startsWith(searchPrefix)
    ) {
      return <Redirect to={location.search.substring(searchPrefix.length)} />;
    }

    return (
      <div className="d-flex flex-column">
        <header>
          <Navbar
            bg="light"
            expand="sm"
            fixed={'top'}
            collapseOnSelect={true}
            className="tscontr-navbar--- border-bottom pt-1 pb-1"
          >
            <LinkContainer exact to={'/'}>
              <Navbar.Brand>
                <span className="text-info mr-1">
                  <i className="fa fa-id-badge" />
                </span>

                <span className="d-md-inline">
                  {' '}
                  Регистрация{' '}
                  <span className="text-danger">
                    <CurrentBreakpoint invisible={true} />
                  </span>{' '}
                </span>
              </Navbar.Brand>
            </LinkContainer>
          </Navbar>
        </header>
        {/* ---- */}
        <main className="tscontr-main flex-fill">
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

export default connect(mapStateToProps, mapDispatchToProps)(MainView);