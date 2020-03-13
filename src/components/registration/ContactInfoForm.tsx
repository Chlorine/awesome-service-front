import React from 'react';
import { StringSchema } from 'yup';

import {
  Button,
  Col,
  DropdownButton,
  Form,
  InputGroup,
  Row,
  Dropdown,
} from 'react-bootstrap';

import classNames from 'classnames';
import NumberFormat from 'react-number-format';

import * as yup from 'yup';
import { Formik, FormikActions, FormikProps } from 'formik';

import { YupSchemes } from '../../utils';

import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';

import {
  PCUtils,
  PhoneCountries,
  PhoneCountry,
} from '../../common-interfaces/phone-numbers';

export type Props = {
  handleSubmit: (
    email: string,
    phone: string,
    phoneCountry: PhoneCountry,
  ) => Promise<void>;
  handleGoBack: () => void;
  initialValues: {
    email: string;
    phone: string;
    phoneCountry: PhoneCountry;
  };
} & WithTranslation;

declare type State = {
  errorMsg: string;
};

declare type FormValues = {
  phoneCountry: PhoneCountry;
  phone: string;
  email: string;
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

// const PhoneInputField

// const REGEXP_FORMATTED_PHONE = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
const REGEXP_PHONE = /^\d{9,14}$/;

// declare type Country

class ContactInfoForm extends React.Component<Props, State> {
  state: State = {
    errorMsg: '',
  };

  // https://codificator.ru/code/phone/
  // https://codificator.ru/code/mobile/

  private scheme = yup.object().shape<FormValues>({
    phoneCountry: YupSchemes.stringField(12) as StringSchema<PhoneCountry>,
    phone: YupSchemes.stringField(64)
      .matches(REGEXP_PHONE, 'formErrors.patternPhone')
      .test({
        name: 'is-valid-ru-operator-code',
        message: 'formErrors.rusPhoneOperatorCode',
        test: function(value: string) {
          if (!value) {
            return true;
          }

          if (this.parent.phoneCountry === 'ru') {
            // Код города/оператора должен начинаться с цифры 3, 4, 5, 6, 8, 9
            if (-1 === [3, 4, 5, 6, 8, 9].indexOf(value.charCodeAt(0) - 0x30)) {
              return false;
            }
          }
          return true;
        },
      })
      .test({
        name: 'is-valid-length',
        message: 'formErrors.patternPhone',
        test: function(value: string) {
          if (!value) {
            return true;
          }

          const fCountry =
            PhoneCountries[this.parent.phoneCountry as PhoneCountry];

          if (fCountry) {
            if (value.length < (fCountry.minLength || 10)) {
              return false;
            }
          }
          return true;
        },
      }),
    email: YupSchemes.email(64),
  });

  private inputFields: { [key in keyof FormValues]?: InputField } = {
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

    const { email, phone, phoneCountry } = values;

    this.props
      .handleSubmit(
        email,
        PCUtils.phoneFromFormValue(phoneCountry, phone),
        phoneCountry,
      )
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
              initialValues={{
                ...initialValues,
                phone: PCUtils.formValueFromPhone(
                  initialValues.phoneCountry,
                  initialValues.phone,
                ),
              }}
              render={(props: FormikProps<FormValues>) => {
                const {
                  handleSubmit,
                  handleReset,
                  isSubmitting,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setFieldTouched,
                  setFieldError,
                } = props;

                const { phoneCountry: country } = values;

                return (
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                  >
                    <Form.Group as={Row}>
                      <Col>
                        <InputGroup>
                          <DropdownButton
                            variant="secondary"
                            as={InputGroup.Prepend}
                            id={'input-group-dropdown-1'}
                            title={
                              <i
                                className={classNames({
                                  'flag-icon': country !== '*',
                                  [`flag-icon-${country}`]: country !== '*',
                                  'fa fa-fw fa-globe': country === '*',
                                })}
                              />
                            }
                          >
                            {Object.keys(PhoneCountries)
                              .filter(k => k !== '*')
                              .map(code => {
                                let country = code as PhoneCountry;
                                return (
                                  <Dropdown.Item
                                    key={code}
                                    href="#"
                                    onClick={() =>
                                      setFieldValue('phoneCountry', country)
                                    }
                                  >
                                    {t(`country.${country}`)}
                                  </Dropdown.Item>
                                );
                              })}
                            <Dropdown.Divider />
                            <Dropdown.Item
                              href="#"
                              onClick={() => setFieldValue('phoneCountry', '*')}
                            >
                              {t(`country.*`)}
                            </Dropdown.Item>
                          </DropdownButton>

                          <NumberFormat
                            getInputRef={this.inputFields.phone!.ref}
                            name="phone"
                            format={PhoneCountries[values.phoneCountry].mask}
                            value={values.phone}
                            mask="_"
                            allowEmptyFormatting={true}
                            type="tel" // "tel"?
                            onValueChange={values1 =>
                              setFieldValue('phone', values1.value)
                            }
                            className="form-control"
                            onBlur={handleBlur}
                            // autoComplete="tel" // <-- фигня с автозаполнением на мобилке, если маска :(
                            removeFormatting={formattedValue => {
                              console.log('removeFormatting', formattedValue);
                              return formattedValue;
                            }}
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
                                  setFieldValue('countryCode', '+7');

                                  setFieldError('phone', '');
                                  setFieldTouched('phone', false);
                                  setFieldValue('phone', '');
                                  this.inputFields.phone!.ref &&
                                    this.inputFields.phone!.ref.current.focus();
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
                            {t(errors['phone'] || '')}
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
                          variant="outline-secondary"
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
                          {t('common.buttons.finish')}
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
