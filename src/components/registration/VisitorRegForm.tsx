import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
// import * as _ from 'lodash';

import * as yup from 'yup';
import { Formik, FormikActions, FormikProps } from 'formik';

import { MinimalVisitorInfo } from '../../common-interfaces/common-front';
import { YupSchemes } from '../../utils';
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import { WithTranslatedFormErrors } from '../common';
import DaDataInput from '../DaData/DaDataInput';
import { DaDataFioSuggestion } from '../DaData/dadata';
import { DaDataGender, DaDataNamePart } from '../DaData/dadata-fio';

export type Props = {
  handleSubmit: (visitorInfo: MinimalVisitorInfo) => Promise<void>;
  initialValues: MinimalVisitorInfo;
} & WithTranslation;

declare type State = {
  errorMsg: string;
  gender: DaDataGender;
};

declare type FormValues = MinimalVisitorInfo;

declare type FieldName = keyof FormValues;
declare type FioFieldName = Exclude<FieldName, 'companyName' | 'position'>;

declare type InputField = {
  placeholder: string;
  autoComplete: string;
  ref?: React.RefObject<any>;
};

declare type FioInputField = {
  placeholder: string;
  namePart: DaDataNamePart;
  autoComplete: string;
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
              className="pl-1 pr-1 border"
              tabIndex={-1}
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

// const HUMAN_NAME_PART = /^([^\$%\^*\/\\\|\{}\<\>\[\]№!#,\'\"\+£=~@€¥₽÷×_&:;?\d]+)+$/;

// const HUMAN_NAME_PART = /^([a-zA-Zа-яёА-ЯЁ -])+$/u;

// со всей кириллицей (ну и a-zA-Z). todo: а немцы?
/*
РусскийЫыЁёЭэЪъ
УкраїнськаІіЇїЄє'
БеларускаяЎў
СрпскиЂђЉљЊњЋћЏџ
СлавянскиеБуквыѰѱѬѭѨѩ

* */
const HUMAN_NAME_PART = /^[\u0400-\u052F\u2DE0-\u2DFF\uA640-\uA69F \-a-zA-Z]+$/;

class VisitorRegForm extends React.Component<Props, State> {
  state: State = {
    errorMsg: '',
    gender: 'UNKNOWN',
  };

  private scheme = yup.object().shape<FormValues>({
    lastName: YupSchemes.stringField(64).matches(
      HUMAN_NAME_PART,
      'formErrors.patternHumanNamePart',
    ),
    firstName: YupSchemes.stringField(64).matches(
      HUMAN_NAME_PART,
      'formErrors.patternHumanNamePart',
    ),
    middleName: YupSchemes.stringField(64, 'optional').matches(
      HUMAN_NAME_PART,
      'formErrors.patternHumanNamePart',
    ),
    companyName: YupSchemes.stringField(64),
    position: YupSchemes.stringField(64),
  });

  private fioInputFields: { [key in FioFieldName]: FioInputField } = {
    lastName: {
      placeholder: 'page01.inputPlaceholders.lastName',
      namePart: 'SURNAME',
      autoComplete: 'family-name',
    },
    firstName: {
      placeholder: 'page01.inputPlaceholders.firstName',
      namePart: 'NAME',
      autoComplete: 'given-name',
    },
    middleName: {
      placeholder: 'page01.inputPlaceholders.middleName',
      namePart: 'PATRONYMIC',
      autoComplete: 'additional-name',
    },
  };

  private inputFields: { [key in keyof FormValues]?: InputField } = {
    companyName: {
      placeholder: 'page01.inputPlaceholders.company',
      autoComplete: 'organization',
      ref: React.createRef<HTMLInputElement>(),
    },
    position: {
      placeholder: 'page01.inputPlaceholders.position',
      autoComplete: 'organization-title',
      ref: React.createRef<HTMLInputElement>(),
    },
  };

  onReset = (values: FormValues, actions: FormikActions<FormValues>) => {
    actions.resetForm();
  };

  onSubmit = (values: FormValues, actions: FormikActions<FormValues>) => {
    values = this.scheme.cast(values);

    // 1) надо немножко попердолить данные формы
    // 2) на копии, а то после enableReinitialize филды у values стали readonly (todo: кстати почему?)

    const formValues = { ...values };

    Object.keys(formValues).forEach(key => {
      let fieldName = key as keyof FormValues;

      // а) вырезать множественные пробелы

      formValues[fieldName] = formValues[fieldName].replace(/\s\s+/g, ' ');

      // дополнительно для ФИО:

      if (['firstName', 'middleName', 'lastName'].includes(fieldName)) {
        let namePart = formValues[fieldName];

        // неясно, делать ли auto-capitalize
        // на мобилке оно само в начале ввода станет с заглавной буквы
        // на компе... то такое. А если пришел барон фон Эрлих? "фон" не надо с большой...

        // temp decision: в жопу немцев

        // _.capitalize попортит "Анна-Мария"

        if (namePart.length > 0) {
          namePart = `${namePart.charAt(0).toUpperCase()}${namePart.substr(1)}`;
        }

        formValues[fieldName] = namePart;
      }
    });

    actions.setValues(formValues);

    console.log('onSubmitRegForm', JSON.stringify(formValues, null, 2));

    this.setState({
      errorMsg: '',
    });

    this.props
      .handleSubmit(formValues)
      .then(() => {
        // вжух!
      })
      .catch(err => this.setState({ errorMsg: err.message }))
      .then(() => {
        actions.setSubmitting(false);
      });
  };

  onSelectSuggestion(
    fieldName: keyof FormValues,
    suggestion: DaDataFioSuggestion,
  ) {
    if (fieldName === 'lastName') {
      this.setState({ gender: suggestion.data.gender });
    } else if (fieldName === 'firstName') {
      if (
        suggestion.data.gender !== 'UNKNOWN' &&
        this.state.gender === 'UNKNOWN'
      ) {
        this.setState({ gender: suggestion.data.gender });
      }
    }
  }

  onFioFieldClear(fieldName: FioFieldName) {
    if (fieldName === 'lastName') {
      this.setState({ gender: 'UNKNOWN' });
    }
  }

  onFioFieldInputChanged(fieldName: FioFieldName) {
    if (fieldName === 'lastName') {
      this.setState({ gender: 'UNKNOWN' });
    }
  }

  render() {
    const { initialValues, t } = this.props;
    const { gender } = this.state;

    return (
      <>
        <Row>
          <Col>
            <Formik
              validationSchema={this.scheme}
              onSubmit={this.onSubmit}
              onReset={this.onReset}
              enableReinitialize={true}
              initialValues={initialValues}
              render={(props: FormikProps<FormValues>) => {
                const {
                  handleSubmit,
                  handleReset,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
                  touched,
                  errors,
                  values,
                } = props;

                return (
                  <WithTranslatedFormErrors formikProps={props}>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      onReset={handleReset}
                    >
                      {/*<Row>*/}
                      {/*  <Col>*/}
                      {/*    <small>*/}
                      {/*      <pre>*/}
                      {/*        {JSON.stringify({ ...values, gender }, null, 2)}*/}
                      {/*      </pre>*/}
                      {/*    </small>*/}
                      {/*  </Col>*/}
                      {/*</Row>*/}
                      {Object.keys(this.fioInputFields).map((key, index) => {
                        const fieldName = key as FioFieldName;
                        const fioInputField = this.fioInputFields[fieldName];
                        return (
                          <Form.Group as={Row} key={index + 123}>
                            <Col>
                              <DaDataInput
                                name={fieldName}
                                placeholder={t(fioInputField.placeholder)}
                                query={values[fieldName]}
                                namePart={fioInputField.namePart}
                                onBtnClear={() => {
                                  setFieldValue(fieldName, '');
                                  this.onFioFieldClear(fieldName);
                                }}
                                onInputChange={value => {
                                  setFieldValue(fieldName, value);
                                  this.onFioFieldInputChanged(fieldName);
                                }}
                                onChange={suggestion => {
                                  setFieldValue(fieldName, suggestion.value);
                                  this.onSelectSuggestion(
                                    fieldName,
                                    suggestion,
                                  );
                                }}
                                onInputBlur={handleBlur}
                                gender={gender}
                                autocomplete={fioInputField.autoComplete}
                                suggestionNote={t('common.suggestionNote')}
                              />
                              {touched[fieldName] && errors[fieldName] && (
                                <Form.Control.Feedback
                                  className="d-block"
                                  type="invalid"
                                >
                                  {t(errors[fieldName] || '')}
                                </Form.Control.Feedback>
                              )}
                            </Col>
                          </Form.Group>
                        );
                      })}
                      {Object.keys(this.inputFields).map((key, index) => {
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
                            type="submit"
                            variant={'primary'}
                            disabled={isSubmitting}
                            className=""
                          >
                            {t('common.buttons.continue')}
                          </Button>
                        </Col>
                      </Form.Group>
                    </Form>
                  </WithTranslatedFormErrors>
                );
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default withTranslation()(VisitorRegForm);
