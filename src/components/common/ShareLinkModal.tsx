import React from 'react';
import QRCode from 'qrcode.react';

// eslint-disable-next-line
import { Button, Modal, Row, Col, Image } from 'react-bootstrap';
import { Utils } from '../../utils';

import { withTranslation, WithTranslation } from 'react-i18next';

export type Props = {
  visible: boolean;
  handleClose: () => void;
} & WithTranslation;

declare type State = {
  qrCodeValue: string;
};

class ShareLinkModal extends React.Component<Props, State> {
  state: State = {
    qrCodeValue: window.location.origin,
  };

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
    const { visible, t } = this.props;
    const { qrCodeValue } = this.state;

    return (
      <Modal
        show={visible}
        onHide={this.onCancel}
        centered
        animation={false}
        backdrop={true}
      >
        <Modal.Body className="pt-5 pb-3">
          <Row>
            <Col className="text-center">
              <h5>{t('common.shareLinkModal.title')}</h5>
              <p className="text-muted">
                {t('common.shareLinkModal.subTitle')}
              </p>
            </Col>
          </Row>
          <Row className="pb-3 pt-2">
            <Col sm={12} className="d-flex align-items-center flex-column">
              <div className="border rounded shadow p-2">
                <QRCode
                  value={qrCodeValue}
                  size={180}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  includeMargin={false}
                  level={'L'}
                  renderAs={'svg'}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="ml-2"
            variant="secondary"
            onClick={this.onCancel}
            disabled={false}
          >
            {t('common.buttons.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withTranslation()(ShareLinkModal);
