import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Setting from "../../models/Setting";
import ShowPlanService from "../PlanService/ShowPlanService";
import axios from 'axios';

interface CompanyData {
  name: string;
  id?: number | string;
  phone?: string;
  email?: string;
  status?: boolean;
  cnpj?: string;
  razaosocial?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  diaVencimento?: string;
  planId?: number;
  campaignsEnabled?: boolean;
  dueDate?: string;
  recurrence?: string;
  isTest?: boolean;
}

const UpdateCompanyService = async (
  companyData: CompanyData
): Promise<Company> => {
  const company = await Company.findByPk(companyData.id);
  const {
    name,
    phone,
    email,
    status,
    cnpj,
    razaosocial,
    cep,
    estado,
    cidade,
    bairro,
    logradouro,
    numero,
    diaVencimento,
    planId,
    campaignsEnabled,
    dueDate,
    recurrence,
    isTest
  } = companyData;

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  await company.update({
    name,
    phone,
    email,
    status,
    cnpj,
    razaosocial,
    cep,
    estado,
    cidade,
    bairro,
    logradouro,
    numero,
    diaVencimento,
    planId,
    dueDate,
    recurrence,
    isTest
  });

  if (companyData.campaignsEnabled !== undefined) {
    const [setting, created] = await Setting.findOrCreate({
      where: {
        companyId: company.id,
        key: "campaignsEnabled"
      },
      defaults: {
        companyId: company.id,
        key: "campaignsEnabled",
        value: `${campaignsEnabled}`
      }
    });
    if (!created) {
      await setting.update({ value: `${campaignsEnabled}` });
    }
  }

  //Atualizar Cliente Asaas
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
    notificationDisabled: false,
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


  //Requisição para recuperar os dados no Asaas usando o name vindo do froont
  await axios.get(`https://www.asaas.com/api/v3/customers?name=${name}`, {
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

  //Requisição para atualizar as info do cliente no Asaas
  await axios.post(`https://www.asaas.com/api/v3/customers/${companyDataAsaas.id}`, {
    'name': `${name}`,
    'email': `${email}`,
    'phone': `${phone}`,
    'mobilePhone': `${phone}`,
    'cpfCnpj': `${cnpj}`,
    'postalCode': `${cep}`,
    'address': `${logradouro}`,
    'addressNumber': `${numero}`,
    'complement': '',
    'province': `${companyDataAsaas.province}`,
    'externalReference': '',
    'notificationDisabled': false,
    'additionalEmails': '',
    'municipalInscription': '',
    'stateInscription': '',
    'observations': 'Novo cliente'
  }, {
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

  //Atualizar Assinatura no Asaas
  let plans = await ShowPlanService(planId);

  let assinaturaClienteAsaas = {
    object: '',
    id: '',
    dateCreated: '',
    customer: '',
    paymentLink: null,
    value: '',
    nextDueDate: '',
    cycle: 'MONTHLY',
    description: '',
    billingType: 'BOLETO',
    deleted: false,
    status: 'ACTIVE',
    externalReference: null,
    sendPaymentByPostalService: false,
    discount: {
      value: 0,
      limitDate: null,
      dueDateLimitDays: 0,
      type: 'PERCENTAGE'
    },
    fine: { value: 10, type: 'PERCENTAGE' },
    interest: { value: 2, type: 'PERCENTAGE' },
    split: null
  };

  //Requisição para recuperar dados da assinatura do cliente no Asaas
  await axios.get(`https://www.asaas.com/api/v3/subscriptions?customer=${companyDataAsaas.id}`, {
    headers: {
      'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAyODQ2NTE6OiRhYWNoXzFjYjgwYmFmLWZjYTQtNGMzNC04NTJkLWUwZGZmOWQ0ZjE5Zg=='
    }
  })
    .then(function (response) {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
      assinaturaClienteAsaas = response.data.data[0];
      console.log("Assinatura Data Asaas: ", assinaturaClienteAsaas);
    })
    .catch(function (error) {
      console.log(error);
    });

  if (plans.value.toString() != assinaturaClienteAsaas.value) {
    //Requisição para atualizar os dados da assinatura do cliente no Asaas
    await axios.post(`https://www.asaas.com/api/v3/subscriptions/${assinaturaClienteAsaas.id}`, {
      'billingType': 'BOLETO',
      'nextDueDate': `${assinaturaClienteAsaas.nextDueDate}`,
      'value': `${plans.value.toFixed(2)}`,
      'cycle': 'MONTHLY',
      'description': `${plans.name}`,
      'updatePendingPayments': false,
      'discount': {
        'value': `${assinaturaClienteAsaas.discount.value}`,
        'dueDateLimitDays': `${assinaturaClienteAsaas.discount.dueDateLimitDays}`
      },
      'fine': {
        'value': `${assinaturaClienteAsaas.fine.value}`
      },
      'interest': {
        'value': `${assinaturaClienteAsaas.fine.value}`
      }
    }, {
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
  }

  return company;
};

export default UpdateCompanyService;
