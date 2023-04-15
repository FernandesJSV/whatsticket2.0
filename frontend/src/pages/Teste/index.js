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
	CircularProgress,
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

const Teste = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	let data = new Date();
	let diaDeHoje = data.getDate();

	const initialState = { cnpj: "", razaosocial: "", name: "", phone: "", cep: "", estado: "", cidade: "", bairro: "", logradouro: "", numero: "", email: "", password: "", diaVencimento: diaDeHoje, planId: 4, isTest: true };

	const [numeroIsSN, setNumeroIsSN] = useState(false);

	function changNumeroIsSN() {
		if (numeroIsSN == false) {
			setNumeroIsSN(true)
		} else {
			setNumeroIsSN(false)
		}
	}

	const [user] = useState(initialState);

	const handleSignUp = async values => {
		const dueDate = moment().add(7, "day").format();
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			console.log(values);
			await openApi.post("/companies/cadastro", values);
			// await openApi.post("/companies/cadastroassas", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [valueTermos, setValueTermos] = useState(false);
	const [cnpj, setCnpj] = useState(initialState.cnpj);
	const [razaosocial, setRazaoSocial] = useState(initialState.razaosocial);
	const [nameEmpresa, setNameEmpresa] = useState(initialState.name);
	const [phoneNumber, setPhoneNumber] = useState(initialState.phone);
	const [cep, setCep] = useState(initialState.cep);
	const [numero, setNumero] = useState(initialState.numero);
	const [estado, setEstado] = useState(initialState.estado);
	const [cidade, setCidade] = useState(initialState.cidade);
	const [bairro, setBairro] = useState(initialState.bairro);
	const [logradouro, setLogradouro] = useState(initialState.logradouro);

	const obterDadosEmpresa = async (cnpj) => {
		cnpj = removeCnpjMask(cnpj);

		const { data } = await openApi.get(`companies/apicnpj/${cnpj}`);
		setRazaoSocial(data.nome);
	}

	const obterEndereco = async (cep) => {
		const url = `https://viacep.com.br/ws/${cep}/json/`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if (!data.erro) {
					preencherCamposComEndereco(data);
				} else {
					return null;
				}
			})
			.catch(error => console.error(error));
	}

	function preencherCamposComEndereco(data) {
		console.log(data);
		setEstado(data.uf);
		setCidade(data.localidade);
		setBairro(data.bairro);
		setLogradouro(data.logradouro);
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

	const phoneMask = (phone) => {
		return phone
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

	const removeCepMask = (cep) => {
		return cep.replace(/\D/g, '');
	}

	const numeroMask = (numero) => {
		numero = numero.replace(/\D/g, '');
		if (numero.length > 5) {
			numero = numero.substring(0, 5);
		}
		return numero;
	}

	useEffect(() => {
		if(cep.length == 9) {
			obterEndereco(cep);
		}
	}, [cep])

	useEffect(() => {
		if(cnpj.length == 18) {
			obterDadosEmpresa(cnpj);
		}
	}, [cnpj])

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
					{"Teste Grátis"}
				</Typography>
				{/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						values.cnpj = removeCnpjMask(cnpj);
						values.razaosocial = razaosocial;
						values.phone = removeCepMask(phoneNumber);
						values.cep = removeCepMask(cep);
						values.estado = estado;
						values.cidade = cidade;
						values.bairro = bairro;
						values.logradouro = logradouro;
						values.numero = numero;
						console.log("Valores form: ", values)
						actions.setSubmitting(true);
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						(isSubmitting) ? (
							<CircularProgress
							 size={60}
							 className={classes.buttonProgress}
							/>
						) : (
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
										onChange={(e) => setCnpj(cnpjMask(e.target.value))}
										value={cnpj}
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
										onChange={(e) => setRazaoSocial(e.target.value)}
										value={razaosocial}
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
										// onChange={(e) => setNameEmpresa(e.target.value)}
										// value={nameEmpresa}
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="phone"
										name="phone"
										error={touched.phone && Boolean(errors.phone)}
										helperText={touched.phone && errors.phone}
										variant="outlined"
										fullWidth
										id="phone"
										label="Telefone"
										onChange={(e) => setPhoneNumber(e.target.value)}
										value={phoneMask(phoneNumber)}
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
										onChange={(e) => setCep(e.target.value)}
										value={cepMask(cep)}
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
										onChange={(e) => setEstado(e.target.value)}
										value={estado}
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
										onChange={(e) => setCidade(e.target.value)}
										value={cidade}
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
										onChange={(e) => setBairro(e.target.value)}
										value={bairro}
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
										onChange={(e) => setLogradouro(e.target.value)}
										value={logradouro}
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
										onChange={(e) => setNumero(e.target.value)}
										value={numeroMask(numero)}
										disabled={
											(numeroIsSN == false) ? (false) : (true)
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
								{/* <Grid item xs={12}>
									<InputLabel htmlFor="diaVencimento-selection">Dia do Vencimento</InputLabel>
									<Field
										as={Select}
										variant="outlined"
										fullWidth
										id="diaVencimento-selection"
										label="diaVencimento"
										name="diaVencimento"
										required
									>
										{valuesInput.diasVencimento.map((value, key) => (
											(value < 10) ? (<MenuItem name="diaVencimento" key={key} value={value} onClick={() => onChangeDiaVencimento(value)}>0{value}</MenuItem>) : <MenuItem name="diaVencimento" key={key} value={value} onClick={() => onChangeDiaVencimento(value)}>{value}</MenuItem>
										))}
									</Field>
								</Grid> */}

								{/* Componente padrão - Seleção de plano */}
								{/* <Grid item xs={12}>
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
								</Grid> */}
							</Grid>
							<Box mt={2}>
								<Typography variant="body2" color="textSecondary" align="center">
									<label>
										<input type={'checkbox'} onClick={() => (valueTermos) ? (setValueTermos(false)) : setValueTermos(true)} />
										<span>Eu li e aceito as </span>
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
						)
					)}
				</Formik>
			</div>
			<Box mt={5}><Copyright /></Box>
		</Container>
	);
};

export default Teste;
