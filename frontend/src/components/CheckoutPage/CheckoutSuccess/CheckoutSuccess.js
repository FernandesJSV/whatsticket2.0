import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import QRCode from 'react-qr-code';
import { SuccessContent, Total } from './style';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';
import { socketConnection } from "../../../services/socket";
import { useDate } from "../../../hooks/useDate";
import { toast } from "react-toastify";
import api from "../../../services/api"
import moment from 'moment';

function CheckoutSuccess(props) {

  const { faturaId } = props;
  const [boleto, setBoleto] = useState({
    identificationField: '',
    nossoNumero: '',
    barCode: ''
  });
  const [pixAsaas, setPixAsaas] = useState({
    encodedImage: '',
    payload: '',
    expirationDate: ''
  });
  const { pix } = props;
  const [isLoading, setIsLoading] = useState(true);
  // const [pixString,] = useState(pix.qrcode.qrcode);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const history = useHistory();

  const { dateToClient } = useDate();

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });
    socket.on(`company-${companyId}-payment`, (data) => {

      if (data.action === "CONCLUIDA") {
        toast.success(`Sua licença foi renovada até ${dateToClient(data.company.dueDate)}!`);
        setTimeout(() => {
          history.push("/");
        }, 4000);
      }
    });
  }, [history, dateToClient]);

  const handleCodBoleto = () => {
    setTimeout(() => {
      setCopiedBoleto(false);
    }, 1 * 5000);
    setCopiedBoleto(true);
  };

  const handleQRCodePix = () => {
    setTimeout(() => {
      setCopiedPix(false);
    }, 1 * 5000);
    setCopiedPix(true);
  };

  const obterBoleto = async (faturaId) => {
    const boleto = await api.get(`/invoicesboleto/${faturaId}`)
      .then((response) => {
        setBoleto(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const obterPix = async (faturaId) => {
    const pix = await api.get(`/invoicespix/${faturaId}`)
      .then((response) => {
        console.log(response.data)
        setPixAsaas(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
    setIsLoading(false);
  }

  useEffect(() => {
    obterBoleto(faturaId);
    obterPix(faturaId);
  }, [faturaId]);

  return (!isLoading &&
    <React.Fragment>
      <Total>
        <span>TOTAL</span>
        <strong>R${pix.value.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</strong>
      </Total>
      <Total>
        <span>Data Vencimento</span>
        <strong>{moment(pix.dueDate).format("DD/MM/YYYY")}</strong>
      </Total>
      <Total>
        <span>Boleto </span>
        <strong>{boleto.barCode}</strong>
      </Total>
      <SuccessContent>
        <CopyToClipboard text={boleto.barCode} onCopy={handleCodBoleto}>
          <button className="copy-button" type="button">
            {copiedBoleto ? (
              <>
                <span>Copiado</span>
                <FaCheckCircle size={18} />
              </>
            ) : (
              <>
                <span>Copiar código de Barras Boleto</span>
                <FaCopy size={18} />
              </>
            )}
          </button>
        </CopyToClipboard>
        <Total>
          {/* <QRCode value={`data:image/png;base64,${pixAsaas.encodedImage}`} size={256} /> */}
          <img style={{position:"relative"}} src={`data:image/png;base64,${pixAsaas.encodedImage}`} />
        </Total>
        <CopyToClipboard text={pixAsaas.payload} onCopy={handleQRCodePix}>
          <button className="copy-button" type="button">
            {copiedPix ? (
              <>
                <span>Copiado</span>
                <FaCheckCircle size={18} />
              </>
            ) : (
              <>
                <span>Copiar PIX</span>
                <FaCopy size={18} />
              </>
            )}
          </button>
        </CopyToClipboard>
        <span>
          Para finalizar, basta realizar o pagamento escaneando o QR code do Pix<br></br>
          ou copiando o código de barra do Boleto! :)
        </span>
      </SuccessContent>
    </React.Fragment>
  );
}

export default CheckoutSuccess;
