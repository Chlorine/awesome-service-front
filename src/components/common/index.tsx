import React, { ReactElement, ReactNode, useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useTranslation, WithTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

export type SmallSpinnerProps = { visible: boolean; className?: string };

export const SmallSpinner: React.FC<SmallSpinnerProps> = ({
  visible,
  className,
}) => {
  if (!visible) return <React.Fragment />;

  return (
    <div className={className}>
      <Spinner animation="border" variant="secondary" size="sm" />
    </div>
  );
};

// чтобы автокомплит
export type KnownIconName =
  | 'exclamation-triangle'
  | 'search'
  | 'barcode'
  | 'list-ul'
  | 'list'
  | 'futbol-o'
  | 'angle-double-left'
  | 'angle-left'
  | 'angle-double-right'
  | 'angle-right'
  | 'check-circle'
  | 'check-circle-o'
  | 'times'
  | 'times-circle'
  | 'times-circle-o'
  | 'refresh'
  | 'cog'
  | 'cogs';

export type FAIconProps = {
  name: KnownIconName;
  fw?: boolean;
};

export const FAIcon: React.FC<FAIconProps> = ({ name, fw }) => {
  // let dummy = <i className="fa fa-hour"/>;
  return <i className={`fa fa-${name} ${fw ? 'fa-fw' : ''}`} />;
};

export const CurrentBreakpoint: React.FC<{ invisible?: boolean }> = ({
  invisible,
}) => {
  return (
    <span>
      {!invisible && (
        <span>
          <span className="d-inline d-sm-none d-md-none d-lg-none d-xl-none">
            xs
          </span>
          <span className="d-none d-sm-inline d-md-none d-lg-none d-xl-none">
            sm
          </span>
          <span className="d-none d-sm-none d-md-inline d-lg-none d-xl-none">
            md
          </span>
          <span className="d-none d-sm-none d-md-none d-lg-inline d-xl-none">
            lg
          </span>
          <span className="d-none d-sm-none d-md-none d-lg-none d-xl-inline">
            xl
          </span>
        </span>
      )}
    </span>
  );
};

export const SimpleCentered: React.FC = props => (
  <Row
    style={{ minHeight: '75vh' }}
    className="d-flex justify-content-center align-items-center"
  >
    <Col lg={{ span: 4 }} md={{ span: 6 }} sm={{ span: 8 }} xs={{ span: 10 }}>
      {props.children}
    </Col>
  </Row>
);

export const WithTranslatedFormErrors: React.FC<{
  formikProps: FormikProps<any>;
}> = props => {
  const { i18n } = useTranslation();
  const {
    errors,
    touched,
    setFieldTouched,
    validateField,
    setFieldValue,
    values,
  } = props.formikProps;

  const onLangChanged = (lang: string): void => {
    console.log('langChanged cb', errors, touched);
    Object.keys(errors).forEach(
      fieldName => {
        if (Object.keys(touched).includes(fieldName)) {
          setFieldTouched(fieldName);
        }
      },
      [errors],
    );
  };

  useEffect(() => {
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  });

  return <>{props.children}</>;
};
