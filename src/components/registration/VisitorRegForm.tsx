import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import * as _ from 'lodash';

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

export type Props = {
  handleSubmit: (visitorInfo: MinimalVisitorInfo) => Promise<void>;
  initialValues: MinimalVisitorInfo;
} & WithTranslation;

declare type State = {
  errorMsg: string;
};

declare type FormValues = MinimalVisitorInfo;

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
const HUMAN_NAME_PART = /^([a-zA-Zа-яёА-ЯЁ -])+$/u;

class VisitorRegForm extends React.Component<Props, State> {
  state: State = {
    errorMsg: '',
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

  private inputFields: { [key in keyof FormValues]: InputField } = {
    lastName: {
      placeholder: 'page01.inputPlaceholders.lastName',
      autoComplete: 'given-name',
      ref: React.createRef<HTMLInputElement>(),
    },
    firstName: {
      placeholder: 'page01.inputPlaceholders.firstName',
      autoComplete: 'given-name',
      ref: React.createRef<HTMLInputElement>(),
    },
    middleName: {
      placeholder: 'page01.inputPlaceholders.middleName',
      autoComplete: 'additional-name',
      ref: React.createRef<HTMLInputElement>(),
    },

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

    values.firstName = _.capitalize(values.firstName.replace(/\s\s+/g, ' '));
    values.middleName = _.capitalize(values.middleName.replace(/\s\s+/g, ' '));
    values.lastName = _.capitalize(values.lastName.replace(/\s\s+/g, ' '));

    values.companyName = values.companyName.replace(/\s\s+/g, ' ');
    values.position = values.position.replace(/\s\s+/g, ' ');

    // TODO: вырезать повторные пробелы например

    actions.setValues(values);

    console.log('onSubmitRegForm', JSON.stringify(values, null, 2));

    this.setState({
      errorMsg: '',
    });

    this.props
      .handleSubmit(values)
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
                const { handleSubmit, handleReset, isSubmitting } = props;

                return (
                  <WithTranslatedFormErrors formikProps={props}>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      onReset={handleReset}
                    >
                      {Object.keys(this.inputFields).map((key, index) => {
                        let fieldName = key as keyof FormValues;
                        return (
                          <Form.Group as={Row} key={index}>
                            <FormField
                              fieldName={fieldName}
                              field={this.inputFields[fieldName]}
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
