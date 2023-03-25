import React, { useState, useEffect } from "react";
import qs from 'query-string'

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logoLoginOption.png";

import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import systemVars from '../../../package.json'
import { red } from "@material-ui/core/colors";

import politicaDePrivacidade from '../../assets/politicaPrivacidade.pdf'
import termosDeUso from '../../assets/termosDeUso.pdf'

const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright "}
			<Link color="inherit" href={"https://" + systemVars.systemVars.controllerDomain}>
				{systemVars.systemVars.appName},
			</Link>{" "}
			{new Date().getFullYear()}
			{". v"}
			{systemVars.systemVars.version}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	img: {
		margin: theme.spacing(1),
		marginBottom: "30px",
		paddingBottom: "30px",
		width: "250px",
		borderBottom: "1px solid #cecece",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	const initialState = { cnpj: "", razaosocial: "", name: "", telefone: "", cep: "", estado: "", cidade: "", bairro: "", logradouro: "", numero: "", email: "", password: "", diaVencimento: "", planId: "", };

	const [numeroIsSN, setNumeroIsSN] = useState(false);

	function changNumeroIsSN() {
		if (numeroIsSN == false) {
			setNumeroIsSN(true)
		} else {
			setNumeroIsSN(false)
		}
	}

	const [user] = useState(initialState);
	const dueDate = moment().add(7, "day").format();
	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { list: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);

	const [valueTermos, setValueTermos] = useState(false);

	const [values, setValues] = useState({
		cnpj: `${initialState.cnpj}`,
		razaosocial: `${initialState.razaosocial}`,
		name: `${initialState.name}`,
		telefone: `${initialState.telefone}`,
		cep: `${initialState.cep}`,
		estado: `${initialState.estado}`,
		cidade: `${initialState.cidade}`,
		bairro: `${initialState.bairro}`,
		logradouro: `${initialState.logradouro}`,
		numero: `${initialState.numero}`,
		diasVencimento: [1, 5, 10, 15, 20, 25],
		diaVencimento: `${initialState.diaVencimento}`,
		planId: `${initialState.planId}`,
	});

	const cadastrarClienteNoAssas = () => {
		let request = new XMLHttpRequest();
		request.open('POST', 'https://sandbox.asaas.com/api/v3/customers');

		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('access_token', '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAyODQ2NTE6OiRhYWNoXzFjYjgwYmFmLWZjYTQtNGMzNC04NTJkLWUwZGZmOWQ0ZjE5Zg==');

		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				console.log('Status:', this.status);
				console.log('Headers:', this.getAllResponseHeaders());
				console.log('Body:', this.responseText);
			}
		};

		let body = {
			'name': values.name,
			'email': values.email,
			'phone': values.telefone,
			'mobilePhone': values.telefone,
			'cpfCnpj': values.cnpj,
			'postalCode': values.cep,
			'address': '',
			'addressNumber': values.numero,
			'complement': '',
			'province': '',
			'externalReference': '',
			'notificationDisabled': false,
			'additionalEmails': '',
			'municipalInscription': '',
			'stateInscription': '',
			'observations': 'Novo cliente'
		};

		request.send(JSON.stringify(body));
	}

	const fazerAssinaturaCliente = () => {
		let request = new XMLHttpRequest();
		request.open('POST', 'https://www.asaas.com/api/v3/subscriptions');

		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('access_token', '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAyODQ2NTE6OiRhYWNoXzFjYjgwYmFmLWZjYTQtNGMzNC04NTJkLWUwZGZmOWQ0ZjE5Zg==');

		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				console.log('Status:', this.status);
				console.log('Headers:', this.getAllResponseHeaders());
				console.log('Body:', this.responseText);
			}
		};

		var body = {
			'customer': '{CUSTOMER_ID}',
			'billingType': 'BOLETO',
			'nextDueDate': `${Date}`,
			'value': values.planId.value,
			'cycle': 'MONTHLY',
			'description': values.planId.name,
			// 'discount': {
			// 	'value': 10,
			// 	'dueDateLimitDays': 0
			// },
			'fine': {
				'value': 1
			},
			'interest': {
				'value': 2
			}
		};

		request.send(JSON.stringify(body));
	}

	const obterEndereco = async (cep) => {
		const url = `https://viacep.com.br/ws/${cep}/json/`;

		return fetch(url)
			.then(response => response.json())
			.then(data => {
				if (!data.erro) {
					return data;
				} else {
					return null;
				}
			})
			.catch(error => console.error(error));
	}

	const obterDadosEmpresa = async (cnpj) => {
		cnpj = removeCnpjMask(cnpj);

		const url = `https://www.receitaws.com.br/v1/cnpj/${cnpj}/days/15`;

		let request = new XMLHttpRequest();

		request.open('GET', url);

		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('Authorization', 'Bearer d8f84800c2b14af485ecdd46aa354a46a8c75dddbfed1759eaa2cd544705b749');

		request.onload = function () {
			if (request.status === 200) {
				let response = JSON.parse(request.responseText);
				return response;
			} else {
				console.log('Erro ao fazer requisição:', request.statusText);
			}
		};

		request.send();
	}

	function preencherCamposComCnpj(data) {
		setValues({
			...values,
			razaosocial: data.nome,
			name: data.fantasia
		})
	}

	function preencherCamposComEndereco(data) {
		setValues({
			...values,
			cep: data.cep,
			estado: data.uf,
			cidade: data.localidade,
			bairro: data.bairro,
			logradouro: data.logradouro
		})
	}

	const onChange = (e) => {
		const { name, value } = e.target

		setValues({
			...values,
			[name]: value
		});

		if (name === 'cep' && value.length === 9) {
			obterEndereco(value).then(data => {
				if (data) {
					preencherCamposComEndereco(data);
				}
			});
		}

		if (name === 'cnpj' && value.length === 18) {
			obterDadosEmpresa(value)
				.then(data => {
					console.log(data)
					if (data) {
						preencherCamposComCnpj(data);
					}
				})
		}

		console.log(values);
	}

	const onChangePlan = (e) => {
		setValues({
			...values,
			planId: e
		})
	}

	const cnpjMask = (cnpj) => {
		return cnpj
			.replace(/\D/g, "")
			.substring(0, 14)
			.replace(/^(\d{2})(\d)/, "$1.$2")
			.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
	}

	const removeCnpjMask = (cnpj) => {
		return cnpj
			.replace(".", "")
			.replace(".", "")
			.replace("/", "")
			.replace("-", "")
	}

	const telefoneMask = (telefone) => {
		return telefone
			.replace(/\D/g, "")
			.substring(0, 11)
			.replace(/^(\d{2})(\d)/, "($1) $2")
			.replace(/(\d)(\d{4})$/, "$1-$2")
	}

	const cepMask = (cep) => {
		return cep
			.replace(/\D/g, '')
			.substring(0, 8)
			.replace(/^(\d{5})(\d)/, '$1-$2')
	}

	const numeroMask = (numero) => {
		numero = numero.replace(/\D/g, '');
		if (numero.length > 5) {
			numero = numero.substring(0, 5);
		}
		return numero;
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				{/* <Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar> */}
				<div>
					<img className={classes.img} src={logo} alt="Whats" />
				</div>
				<Typography component="h1" variant="h5">
					{i18n.t("signup.title")}
				</Typography>
				{/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="cnpj"
										name="cnpj"
										error={touched.cnpj && Boolean(errors.cnpj)}
										helperText={touched.cnpj && errors.cnpj}
										variant="outlined"
										fullWidth
										required
										id="cnpj"
										label="CNPJ da Empresa"
										onChange={onChange}
										value={cnpjMask(values.cnpj)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="razaosocial"
										name="razaosocial"
										error={touched.razaosocial && Boolean(errors.razaosocial)}
										helperText={touched.razaosocial && errors.razaosocial}
										variant="outlined"
										fullWidth
										id="razaosocial"
										label="Razão Social"
										value={values.razaosocial}
										onChange={onChange}
									/>
								</Grid>

								{/* Componente padrão - Nome da empresa */}
								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="name"
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										fullWidth
										id="name"
										label="Nome da Empresa"
										// value={values.name}
										// onChange={onChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="telefone"
										name="telefone"
										error={touched.telefone && Boolean(errors.telefone)}
										helperText={touched.telefone && errors.telefone}
										variant="outlined"
										fullWidth
										id="telefone"
										label="Telefone"
										onChange={onChange}
										value={telefoneMask(values.telefone)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="cep"
										name="cep"
										error={touched.cep && Boolean(errors.cep)}
										helperText={touched.cep && errors.cep}
										variant="outlined"
										fullWidth
										id="cep"
										label="CEP"
										onChange={onChange}
										value={cepMask(values.cep)}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="estado"
										name="estado"
										error={touched.estado && Boolean(errors.estado)}
										helperText={touched.estado && errors.estado}
										variant="outlined"
										fullWidth
										id="estado"
										label="Estado"
										onChange={onChange}
										value={values.estado}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="cidade"
										name="cidade"
										error={touched.cidade && Boolean(errors.cidade)}
										helperText={touched.cidade && errors.cidade}
										variant="outlined"
										fullWidth
										id="cidade"
										label="Cidade"
										onChange={onChange}
										value={values.cidade}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="bairro"
										name="bairro"
										error={touched.bairro && Boolean(errors.bairro)}
										helperText={touched.bairro && errors.bairro}
										variant="outlined"
										fullWidth
										id="bairro"
										label="Bairro"
										onChange={onChange}
										value={values.bairro}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="logradouro"
										name="logradouro"
										error={touched.logradouro && Boolean(errors.logradouro)}
										helperText={touched.logradouro && errors.logradouro}
										variant="outlined"
										fullWidth
										id="logradouro"
										label="Logradouro"
										onChange={onChange}
										value={values.logradouro}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="numero"
										name="numero"
										error={touched.numero && Boolean(errors.numero)}
										helperText={touched.numero && errors.numero}
										variant="outlined"
										fullWidth
										id="numero"
										label="Número"
										onChange={onChange}
										value={
											(numeroIsSN == false) ? (numeroMask(values.numero)) : ("S/N")
										}
									/>
									<label>
										<span>Sem número</span>
										<input type='checkbox' onClick={changNumeroIsSN} />
									</label>
								</Grid>

								{/* Componente padrão - Email */}
								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										id="email"
										label={i18n.t("signup.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										required
									/>
								</Grid>

								{/* Componente padrão - Senha */}
								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										label={i18n.t("signup.form.password")}
										type="password"
										id="password"
										autoComplete="current-password"
										required
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel htmlFor="diaVencimento-selection">Dia do Vencimento</InputLabel>
									<Field
										as={Select}
										variant="outlined"
										fullWidth
										id="diaVencimento-selection"
										label="diaVencimento"
										name="diaVencimento"
										value={values.diaVencimento}
										onChange={onChange}
										required
									>
										{values.diasVencimento.map((value, key) => (
											(value < 10) ? (<MenuItem name="diaVencimento" key={key} value={value}>0{value}</MenuItem>) : <MenuItem name="diaVencimento" key={key} value={value} onClick={onChange}>{value}</MenuItem>
										))}
									</Field>
								</Grid>

								{/* Componente padrão - Seleção de plano */}
								<Grid item xs={12}>
									<InputLabel htmlFor="plan-selection">Plano</InputLabel>
									<Field
										as={Select}
										variant="outlined"
										fullWidth
										id="plan-selection"
										label="Plano"
										name="planId"
										required
									>
										{plans.map((plan, key) => (
											<MenuItem key={key} value={plan.id} name="planId" onClick={() => onChangePlan(plan.id)}>
												{plan.name} - Atendentes: {plan.users} - WhatsApp: {plan.connections} - Filas: {plan.queues} - R$ {plan.value}
											</MenuItem>
										))}
									</Field>
								</Grid>
							</Grid>
							<Box mt={2}>
								<Typography variant="body2" color="textSecondary" align="center">
									<label>
										<input type={'checkbox'} onClick={() => (valueTermos) ? (setValueTermos(false)) : setValueTermos(true)} />
										<span>Eu aceito as </span>
										<Link target={'_blank'} download='Política de Privacidade Whatsticket.pdf' color="inherit" href={politicaDePrivacidade}>
											{"Políticas de Privacidade"}
										</Link>{" e os "}
										<Link target={'_blank'} download='Termos de Uso.pdf' color="inherit" href={termosDeUso}>
											{"Termos de Uso"}
										</Link>
									</label>
								</Typography>
							</Box>
							{/* Componente padrão - Botão de Cadastro */}
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								disabled={!valueTermos}
							onClick={() => {
								cadastrarClienteNoAssas();
							}}
							>
								{i18n.t("signup.buttons.submit")}
							</Button>
							<Grid container justify="flex-end">
								<Grid item>
									<Link
										href="#"
										variant="body2"
										component={RouterLink}
										to="/login"
									>
										{i18n.t("signup.buttons.login")}
									</Link>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
			<Box mt={5}><Copyright /></Box>
		</Container>
	);
};

export default SignUp;
