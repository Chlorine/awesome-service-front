import React from 'react';

import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Utils } from '../../utils';

export type Props = {
  visible: boolean;
  handleClose: (confirmed: boolean) => void;
};

declare type State = {};

class StartOverConfirmModal extends React.Component<Props, State> {
  state: State = {};

  onCancel = () => {
    this.props.handleClose(false);
  };

  onOk = () => {
    this.props.handleClose(true);
  };

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ): void {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.performFunnyPresentation().catch(err => console.error);
    }
  }

  async performFunnyPresentation(): Promise<void> {
    await Utils.delay(15);
  }

  render() {
    const { visible } = this.props;
    // const { } = this.state;

    return (
      <Modal
        show={visible}
        onHide={this.onCancel}
        centered
        animation={false}
        backdrop={true}
      >
        <Modal.Body className="pt-3 pb-3">
          <Row>
            <Col>
              <p>
                <i className="fa fa-fw fa-question-circle text-info" />{' '}
                Повторить ввод данных?
              </p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={this.onOk} disabled={false}>
            Повторить
          </Button>
          <Button
            className="ml-2"
            variant="secondary"
            onClick={this.onCancel}
            disabled={false}
          >
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default StartOverConfirmModal;
