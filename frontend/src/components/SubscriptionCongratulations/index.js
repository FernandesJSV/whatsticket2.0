import React from 'react'
import { Typography, Grid } from '@material-ui/core';

const SubscriptionCongratulations = () => {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
                Assinatura
            </Typography>
            <Grid container>
                <React.Fragment>
                    <Grid style={{textAlign: "center"}}>
                        <Typography gutterBottom>Após clicar no botão de assinar, será atualizado os dados preenchidos anteriomente, além do novo plano selecionado</Typography>
                    </Grid>
                </React.Fragment>
            </Grid>
        </React.Fragment>
    )
}

export default SubscriptionCongratulations