import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";

import CheckoutSuccess from "../CheckoutPage/CheckoutSuccess";
import AddressForm from "../CheckoutPage/Forms/AddressForm";
import PlansSelectForm from "../CheckoutPage/Forms/PlansSelectForm";
import ReviewOrder from "../CheckoutPage/ReviewOrder";

import { toast } from "react-toastify";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import api from "../../services/api";


import checkoutFormModel from "../CheckoutPage/FormModel/checkoutFormModel";
import formInitialValues from "../CheckoutPage/FormModel/formInitialValues";
import validationSchema from "../CheckoutPage/FormModel/validationSchema";

import useStyles from "../CheckoutPage/styles";
import SubscriptionCongratulations from "../SubscriptionCongratulations";


export default function CheckoutPage(props) {
  const { infoCompany } = props;
  const { faturaId } = props;
  const steps = ["Dados", "Personalizar", "Revisar", "Parabéns"];
  const { formId, formField } = checkoutFormModel;



  const [invoice, setInvoice] = useState(props.Invoice)
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [datePayment, setDatePayment] = useState(null);
  const [invoiceId, setinvoiceId] = useState(props.Invoice.id);
  const currentValidationSchema = validationSchema[activeStep + 1];
  const isLastStep = activeStep === steps.length - 1;
  const { user } = useContext(AuthContext);

  function _renderStepContent(step, setFieldValue, setActiveStep, values) {

    switch (step) {
      case 0:
        return <AddressForm formField={formField} values={values} setFieldValue={setFieldValue} infoCompany={infoCompany} />;
      case 1:
        return <PlansSelectForm
          formField={formField}
          setFieldValue={setFieldValue}
          setActiveStep={setActiveStep}
          activeStep={step}
          invoiceId={invoiceId}
          values={values}
        />;
      case 2:
        return <ReviewOrder />;
      // case 3:
      //   return <CheckoutSuccess pix={invoice} faturaId={faturaId} />
      case 3: 
        return <SubscriptionCongratulations/>
      default:
        return <div>Not Found</div>;
    }
  }


  async function _submitForm(values, actions) {
    try {
      const plan = JSON.parse(values.plan);
      const newValues = {
        name: values.name,
        phone: infoCompany.phone,
        id: infoCompany.id,
        email: values.email,
        status: true,
        cnpj: values.cnpj,
        razaosocial: infoCompany.razaosocial,
        cep: values.zipcode,
        estado: values.state,
        cidade: values.city,
        bairro: infoCompany.bairro,
        logradouro: values.address2,
        numero: values.numero2,
        diaVencimento: infoCompany.diaVencimento,
        planId: plan.planId,
        campaignsEnabled: true,
        dueDate: infoCompany.dueDate,
        recurrence: infoCompany.recurrence,
        isTest: infoCompany.isTest
        // country: values.country,
        // useAddressForPaymentDetails: values.useAddressForPaymentDetails,
        // plan: values.plan,
        // price: plan.price,
        // users: plan.users,
        // connections: plan.connections,
        // invoiceId: invoiceId
      }
      const { data } = await api.put(`/companies/${values.company.id}`, newValues);
      setDatePayment(data)
      actions.setSubmitting(true);
      setActiveStep(activeStep);
      toast.success("Assinatura realizada com sucesso!, aguardando a realização do pagamento");
      toast.success("Você pode conferir e fazer o seu pagamento pela tela de Financeiro");
      actions.setSubmitting(false);
    } catch (err) {
      actions.setSubmitting(false);

      toastError(err);
    }
  }

  function _handleSubmit(values, actions) {
    if (isLastStep) {
      _submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
      console.log(activeStep);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <React.Fragment>
      <Typography component="h1" variant="h4" align="center">
        Falta pouco!
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        {activeStep === steps.length ? (
          <CheckoutSuccess pix={datePayment} faturaId={faturaId} />
        ) : (
          <Formik
            initialValues={{
              ...user,
              ...formInitialValues
            }}
            validationSchema={currentValidationSchema}
            onSubmit={_handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form id={formId}>
                {_renderStepContent(activeStep, setFieldValue, setActiveStep, values)}

                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={_handleBack} className={classes.button}>
                      VOLTAR
                    </Button>
                  )}
                  <div className={classes.wrapper}>
                    {activeStep !== 1 && (
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        {isLastStep ? "ASSINAR" : "PRÓXIMO"}
                      </Button>
                    )}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </React.Fragment>
    </React.Fragment>
  );
}
