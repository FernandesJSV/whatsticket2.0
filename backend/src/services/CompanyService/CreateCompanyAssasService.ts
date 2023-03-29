import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import User from "../../models/User";
import Setting from "../../models/Setting";
import axios from "axios";

interface CompanyData {
    name: string;
    phone?: string;
    email?: string;
    password?: string;
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
}

const CreateCompanyAssasService = async (
    companyData: CompanyData
) => {
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
        password,
        campaignsEnabled,
        dueDate,
        recurrence
    } = companyData;

    let customeid = 0;

    //Requisição para a API do Asaas para realizar o cadastro do cliente
    axios.post('https://www.asaas.com/api/v3/customers', {
        'name': `${name}`,
        'email': `${email}`,
        'phone': `${phone}`,
        'mobilePhone': `${phone}`,
        'cpfCnpj': `${cnpj}`,
        'postalCode': `${cep}`,
        'address': `${logradouro}`,
        'addressNumber': `${numero}`,
        'complement': '',
        'province': `${bairro}`,
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
            customeid = response.data;
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });

    let data = new Date();

    //Requisição para a API do Asaas para criação da assinatura para cliente criado
    axios.post("https://www.asaas.com/api/v3/subscriptions", {
        'customer': `${customeid}`,
        'billingType': 'BOLETO',
        'nextDueDate': `${data.getFullYear()}-${data.getMonth() + 2}-${diaVencimento}`,
        'value': 19.9,
        'cycle': 'MONTHLY',
        'description': 'Assinatura Plano Pró',
        'discount': {
            'value': 0,
            'dueDateLimitDays': 0
        },
        'fine': {
            'value': 10
        },
        'interest': {
            'value': 2
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
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
        return error;
    });

};

export default CreateCompanyAssasService;