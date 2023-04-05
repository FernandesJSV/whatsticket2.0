import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import {
	IconButton,
	InputAdornment
} from '@material-ui/core';
import {
	Visibility,
	VisibilityOff
} from '@material-ui/icons';

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logoLoginOption.png";
import { systemVars } from "../../../package.json";

import politicaDePrivacidade from '../../assets/politicaPrivacidade.pdf'
import termosDeUso from '../../assets/termosDeUso.pdf'

const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright "}
			<Link color="inherit" href={"https://" + systemVars.controllerDomain}>
				{systemVars.appName},
			</Link>{" "}
			{new Date().getFullYear()}
			{". v"}
			{systemVars.version}
		</Typography>
	);
};

const PoliticaPrivacidadeTermosDeUso = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			<Link target={'_blank'} download='Política de Privacidade Whatsticket.pdf' color="inherit" href={politicaDePrivacidade}>
				{"Política de Privacidade"}
			</Link>{" e "}
			<Link target={'_blank'} download='Termos de Uso.pdf' color="inherit" href={termosDeUso}>
				{"Termos de Uso"}
			</Link>
		</Typography>
	)
}

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	img: {
		margin: theme.spacing(1),
		marginBottom: "30px",
		paddingBottom: "30px",
		width: "250px",
		borderBottom: "1px solid #cecece",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<div>
					<img className={classes.img} src={logo} alt="Whats" />
				</div>
				<Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography>
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						// type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
						type={showPassword ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword((e) => !e)}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						{i18n.t("login.buttons.submit")}
					</Button>
					<Grid container>
						<Grid item style={{marginBottom: "4%"}}>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/signup"
							>
								{i18n.t("login.buttons.register")}
							</Link>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/testegratis"
							>
								{"Teste gratuitamente por 7 dias!"}
							</Link>
						</Grid>
					</Grid>

				</form>
			</div>
			<Box mt={8}><Copyright /></Box>
			<Box mt={3}><PoliticaPrivacidadeTermosDeUso/></Box>
		</Container>
	);
};

export default Login;
