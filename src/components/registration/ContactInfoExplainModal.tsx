import React from 'react';

// eslint-disable-next-line
import { Button, Modal, Row, Col, Image } from 'react-bootstrap';
import { Utils } from '../../utils';

import THE_IMAGE from './../../images/kumamon.png';

export type Props = {
  visible: boolean;
  handleClose: () => void;
};

declare type State = {};

class ContactInfoExplainModal extends React.Component<Props, State> {
  state: State = {};

  onCancel = () => {
    this.props.handleClose();
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
        <Modal.Header closeButton={true}>
          <Modal.Title>Что значит зачем?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-3">
          <Image fluid={true} src={THE_IMAGE} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="ml-2"
            variant="secondary"
            onClick={this.onCancel}
            disabled={false}
          >
            Понятно
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ContactInfoExplainModal;
