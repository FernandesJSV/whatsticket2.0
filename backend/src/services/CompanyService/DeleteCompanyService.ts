import Company from "../../models/Company";
import AppError from "../../errors/AppError";
import axios from 'axios';

const DeleteCompanyService = async (id: string): Promise<void> => {
  const company = await Company.findOne({
    where: { id }
  });

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  let companyDataAsaas = {
    object: '',
    id: '',
    dateCreated: '',
    name: '',
    email: '',
    company: null,
    phone: '',
    mobilePhone: '',
    address: '',
    addressNumber: '',
    complement: null,
    province: '',
    postalCode: '',
    cpfCnpj: '',
    personType: '',
    deleted: false,
    additionalEmails: null,
    externalReference: null,
    notificationDisabled: true,
    observations: '',
    municipalInscription: null,
    stateInscription: null,
    canDelete: true,
    cannotBeDeletedReason: null,
    canEdit: true,
    cannotEditReason: null,
    foreignCustomer: false,
    city: '',
    state: '',
    country: ''
  };

  //Recuperar dados do cliente no Asaas
  await axios.get(`https://www.asaas.com/api/v3/customers?name=${company.name}`, {
    headers: {
      'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAyODQ2NTE6OiRhYWNoXzFjYjgwYmFmLWZjYTQtNGMzNC04NTJkLWUwZGZmOWQ0ZjE5Zg=='
    }
  })
    .then(function (response) {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
      companyDataAsaas = response.data.data[0];
      console.log("Company Data Asaas: ", companyDataAsaas);
    })
    .catch(function (error) {
      console.log(error);
    });

  //Deletar cliene no Asaas
  await axios.delete(`https://www.asaas.com/api/v3/customers/${companyDataAsaas.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAyODQ2NTE6OiRhYWNoXzFjYjgwYmFmLWZjYTQtNGMzNC04NTJkLWUwZGZmOWQ0ZjE5Zg=='
    }
  })
    .then(function (response) {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  await company.destroy();
};

export default DeleteCompanyService;
