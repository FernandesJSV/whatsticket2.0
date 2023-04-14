import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { InputField, SelectField } from "../../FormFields";
import { AuthContext } from "../../../context/Auth/AuthContext";

// const countries = [
//   {
//     value: "BR",
//     label: "Brasil",
//   },
//   {
//     value: "usa",
//     label: "United States",
//   },
// ];

export default function AddressForm(props) {

  const { infoCompany } = props;
  const { user } = useContext(AuthContext);
  const [billingName, setBillingName] = useState(infoCompany.name);
  const [icnpj, setcnpj] = useState(infoCompany.cnpj);
  const [addressZipCode, setAddressZipCode] = useState(infoCompany.cep);
  const [addressStreet, setAddressStreet] = useState(infoCompany.logradouro);
  const [numero, setNumero] = useState(infoCompany.numero);
  const [addressState, setAddressState] = useState(infoCompany.estado);
  const [addressCity, setAddressCity] = useState(infoCompany.cidade);
  const [bairro, setBairro] = useState(infoCompany.bairro);
  const [addressDistrict, setAddressDistrict] = useState("Brasil");

  const {
    formField: {
      firstName,
      cnpj,
      address1,
      city,
      bairro2,
      state,
      zipcode,
      country,
    },
    setFieldValue
  } = props;
  useEffect(() => {
    setFieldValue("firstName", billingName)
    setFieldValue("cnpj", icnpj);
    setFieldValue("zipcode", addressZipCode)
    setFieldValue("address2", addressStreet);
    setFieldValue("numero2", numero);
    setFieldValue("state", addressState)
    setFieldValue("city", addressCity)
    setFieldValue("bairro2", bairro)
    setFieldValue("country", addressDistrict)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Vamos precisar de algumas informações
      </Typography>
      <Grid container spacing={3}>

        <Grid item xs={6} sm={6}>
          <InputField name={firstName.name} label={firstName.label} fullWidth
            value={billingName}
            onChange={(e) => {
              setBillingName(e.target.value)
              setFieldValue("firstName", e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <InputField name="cnpj" label="CNPJ" fullWidth
            value={icnpj}
            onChange={(e) => {
              setcnpj(e.target.value)
              setFieldValue("cnpj", e.target.value);
            }}
          />
        </Grid>
        {/* <Grid item xs={6} sm={6}>
          <SelectField
            name={country.name}
            label={country.label}
            data={countries}
            fullWidth
            value={addressDistrict}
            onChange={(e) => {
              setAddressDistrict(e.target.value)
              setFieldValue("country", e.target.value)
            }
            }
          />
        </Grid> */}

        <Grid item xs={3}>
          <InputField
            name={zipcode.name}
            label={zipcode.label}
            value={addressZipCode}
            fullWidth
            onChange={(e) => {
              setAddressZipCode(e.target.value)
              setFieldValue("zipcode", e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <InputField
            name={address1.name}
            label={address1.label}
            fullWidth
            value={addressStreet}
            onChange={(e) => {
              setAddressStreet(e.target.value)
              setFieldValue("address2", e.target.value)

            }}
          />
        </Grid>
        <Grid item xs={3}>
          <InputField
            name="numero"
            label="Número"
            fullWidth
            value={numero}
            onChange={(e) => {
              setNumero(e.target.value)
              setFieldValue("numero2", e.target.value)

            }}
          />
        </Grid>

        <Grid item xs={3}>
          <InputField
            name={state.name}
            label={state.label}
            fullWidth
            value={addressState}
            onChange={(e) => {
              setAddressState(e.target.value)
              setFieldValue("state", e.target.value)

            }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            name={city.name}
            label={city.label}
            fullWidth
            value={addressCity}
            onChange={(e) => {
              setAddressCity(e.target.value)
              setFieldValue("city", e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <InputField
            name="bairro"
            label="Bairro"
            fullWidth
            value={bairro}
            onChange={(e) => {
              setBairro(e.target.value)
              setFieldValue("state", e.target.value)

            }}
          />
        </Grid>     
      </Grid>
    </React.Fragment>
  );
}
