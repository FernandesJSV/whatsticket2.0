import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import SubscriptionModal from "../../components/SubscriptionModal";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainContainer from "../../components/MainContainer";

import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import api from "../../services/api";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const _formatDate = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.abs(now.getTime() - past.getTime());
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days;
}

const quantDays = (date) => {
  const now = moment().get('dayOfYear');
  date = moment(date).get('dayOfYear');
  let days = date - now;
  return days;
}

const Contacts = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const { finder: finder } = usePlans();
  const [company, setCompany] = useState({});
  const [plan, setPlans] = useState({});
  const [loading, setLoading] = useState(false);
  const [, setPageNumber] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [hasMore,] = useState(false);

  const findCompany = async (id) => {
    const company = await api.get(`/companies/${id}`);
    return company.data;
  }

  const listarPlanos = async (id) => {
    if (id != undefined && company != {}) {
      const plano = await finder(id);
      return plano;
    }
  }

  const handleOpenContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  //Busca a empresa no banco quando a página e carregada
  useEffect(() => {
    const fetchData = async () => {
      const [companyData] = await Promise.all([
        findCompany(user?.company?.id)
      ]);
      setCompany(companyData);
    };
    fetchData();
  }, []);

  //Busca o plano da empresa no banco quando o company é alterado
  //Aqui eu fiz a requisião através da hook usePlans
  useEffect(() => {
    const fetchData = async () => {
      const [planData] = await Promise.all([
        listarPlanos(company.planId)
      ]);
      setPlans(planData);
    }

    fetchData();
  }, [company]);

  useEffect(() => {
    console.log("Empresa: ", company);
    console.log("Plano da Empresa: ", plan);
  }, [plan]);

  setTimeout(() => {
    setLoading(true);
  }, 500);


  return (loading &&
    <MainContainer className={classes.mainContainer}>
      {/* Aqui ainda tenho que passar os dados da cobrança */}
      <SubscriptionModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        aria-labelledby="form-dialog-title"
        contactId={selectedContactId}
        isSubscription={true}
        Invoice={user}
        infoCompany={company}
      ></SubscriptionModal>

      <MainHeader>
        <Title>Assinatura</Title>
      </MainHeader>
      <Grid item xs={12} sm={4}>
        <Paper
          className={classes.mainPaper}
          variant="outlined"
          onScroll={handleScroll}
        >

          <div>
            {company.isTest ? (
              <TextField
                id="outlined-full-width"
                label="Período de teste"
                defaultValue={`Seu período de teste termina em ${quantDays(company.dueDate)} dias!`}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            ) : (
              <TextField
                id="outlined-full-width"
                label="Próximo Vencimento"
                defaultValue={`Sua próxima cobrança é em ${quantDays(company.dueDate)} dias!`}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            )}
          </div>

          <div>
            <TextField
              id="outlined-full-width"
              label="Email de cobrança"
              value={company.email}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />

          </div>

          <div>
            {
              company.isTest ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenContactModal}
                  fullWidth
                >
                  Assine Agora!
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenContactModal}
                  fullWidth
                >
                  Mudar Plano
                </Button>
              )
            }
          </div>

        </Paper>
      </Grid>
    </MainContainer>
  );
};

export default Contacts;
