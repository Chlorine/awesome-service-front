import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

import * as yup from 'yup';
import { Formik, FormikActions, FormikProps } from 'formik';

import { YupSchemes } from '../../utils';
import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';

export type Props = {
  handleSubmit: (email: string, phone: string) => Promise<void>;
  handleGoBack: () => void;
  initialValues: {
    email: string;
    phone: string;
  };
} & WithTranslation;

declare type State = {
  errorMsg: string;
};

declare type FormValues = {
  email: string;
  phone: string;
};

declare type InputField = {
  placeholder: string;
  autoComplete: string;
  ref?: React.RefObject<any>;
};

const FormField: React.FC<{
  fieldName: keyof FormValues;
  field: InputField;
  formikProps: FormikProps<FormValues>;
}> = ({ fieldName, field, formikProps }) => {
  const { placeholder, autoComplete, ref } = field;
  const {
    handleBlur,
    handleChange,
    values,
    setFieldValue,
    setFieldTouched,
    touched,
    errors,
  } = formikProps;

  const { t } = useTranslation();

  return (
    <Col>
      <InputGroup>
        <Form.Control
          type="text"
          name={fieldName}
          placeholder={t(placeholder)}
          onBlur={handleBlur}
          maxLength={64}
          onChange={handleChange}
          value={values[fieldName]}
          autoComplete={autoComplete}
          ref={ref}
        />
        {values[fieldName] && (
          <InputGroup.Append>
            <Button
              tabIndex={-1}
              className="pl-1 pr-1 border"
              variant="light"
              onClick={(ev: React.SyntheticEvent<HTMLButtonElement>) => {
                ev.preventDefault();
                setFieldValue(fieldName, '');
                setFieldTouched(fieldName, false);
                ref && ref.current.focus();
              }}
            >
              <span className="text-muted">
                <i className="fa fa-times" />
              </span>
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>
      {touched[fieldName] && errors[fieldName] && (
        <Form.Control.Feedback className="d-block" type="invalid">
          {t(errors[fieldName] || '')}
        </Form.Control.Feedback>
      )}
    </Col>
  );
};

const REGEXP_PHONE = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

class ContactInfoForm extends React.Component<Props, State> {
  state: State = {
    errorMsg: '',
  };

  private scheme = yup.object().shape<FormValues>({
    email: YupSchemes.email(64),
    // phone: YupSchemes.stringField(64).matches(
    //   REGEXP_PHONE,
    //   'Некорректный номер телефона', // TODO: yup localize
    // ),
    phone: YupSchemes.stringField(64).matches(REGEXP_PHONE),
  });

  private inputFields: { [key in keyof FormValues]: InputField } = {
    phone: {
      placeholder: 'page02.inputPlaceholders.phone',
      autoComplete: 'tel',
      ref: React.createRef<HTMLInputElement>(),
    },
    email: {
      placeholder: 'page02.inputPlaceholders.email',
      autoComplete: 'email',
      ref: React.createRef<HTMLInputElement>(),
    },
  };

  onReset = (values: FormValues, actions: FormikActions<FormValues>) => {
    actions.resetForm();
  };

  onSubmit = (values: FormValues, actions: FormikActions<FormValues>) => {
    values = this.scheme.cast(values);

    actions.setValues(values);

    console.log('onSubmitContactInfoForm', JSON.stringify(values, null, 2));

    this.setState({
      errorMsg: '',
    });

    this.props
      .handleSubmit(values.email, values.phone)
      .then(() => {
        // вжух!
      })
      .catch(err => this.setState({ errorMsg: err.message }))
      .then(() => {
        actions.setSubmitting(false);
      });
  };

  render() {
    const { initialValues, t } = this.props;

    return (
      <>
        <Row>
          <Col>
            <Formik
              validationSchema={this.scheme}
              onSubmit={this.onSubmit}
              onReset={this.onReset}
              initialValues={initialValues}
              render={(props: FormikProps<FormValues>) => {
                const {
                  handleSubmit,
                  handleReset,
                  isSubmitting,
                  handleBlur,
                  handleChange,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setFieldTouched,
                } = props;

                return (
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                  >
                    <Form.Group as={Row}>
                      <Col>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="phone"
                            placeholder={t('page02.inputPlaceholders.phone')}
                            onBlur={handleBlur}
                            maxLength={64}
                            onChange={handleChange}
                            value={values['phone']}
                            autoComplete="tel"
                            ref={this.inputFields.phone.ref}
                          />
                          {values['phone'] && (
                            <InputGroup.Append>
                              <Button
                                tabIndex={-1}
                                className="pl-1 pr-1 border"
                                variant="light"
                                onClick={(
                                  ev: React.SyntheticEvent<HTMLButtonElement>,
                                ) => {
                                  ev.preventDefault();
                                  setFieldValue('phone', '');
                                  setFieldTouched('phone', false);
                                  this.inputFields.phone.ref &&
                                    this.inputFields.phone.ref.current.focus();
                                }}
                              >
                                <span className="text-muted">
                                  <i className="fa fa-times" />
                                </span>
                              </Button>
                            </InputGroup.Append>
                          )}
                        </InputGroup>
                        {touched['phone'] && errors['phone'] && (
                          <Form.Control.Feedback
                            className="d-block"
                            type="invalid"
                          >
                            {errors['phone']}
                          </Form.Control.Feedback>
                        )}
                      </Col>
                    </Form.Group>
                    {Object.keys(this.inputFields)
                      .filter(key => key !== 'phone')
                      .map((key, index) => {
                        let fieldName = key as keyof FormValues;

                        return (
                          <Form.Group as={Row} key={index}>
                            <FormField
                              fieldName={fieldName}
                              field={this.inputFields[fieldName]!}
                              formikProps={props}
                            />
                          </Form.Group>
                        );
                      })}
                    <Form.Group as={Row}>
                      <Col className="d-flex align-items-center justify-content-start mt-1">
                        <Button
                          variant="secondary"
                          disabled={isSubmitting}
                          onClick={() => this.props.handleGoBack()}
                        >
                          {t('common.buttons.back')}
                        </Button>
                        <Button
                          className="ml-2"
                          type="submit"
                          variant={'primary'}
                          disabled={isSubmitting}
                        >
                          {t('common.buttons.continue')}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                );
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default withTranslation()(ContactInfoForm);
