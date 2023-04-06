import express from "express";
import isAuth from "../middleware/isAuth";
import * as QueueOptionController from "../controllers/QueueOptionController";
import * as InvoicesController from "../controllers/InvoicesController"

const invoiceRoutes = express.Router();

invoiceRoutes.get("/invoices", isAuth, InvoicesController.index);
invoiceRoutes.get("/invoices/list", InvoicesController.list);
invoiceRoutes.get("/invoices/all", isAuth, InvoicesController.list);
invoiceRoutes.get("/invoices/:Invoiceid", isAuth, InvoicesController.show);
invoiceRoutes.put("/invoices/:id", isAuth, InvoicesController.update);
invoiceRoutes.get("/invoicesasaas/:companyId", isAuth, InvoicesController.listInvoicesAsaas);
invoiceRoutes.get("/invoicesboleto/:faturaId", isAuth, InvoicesController.findBoletoAsaas);
invoiceRoutes.get("/invoicespix/:faturaId", isAuth, InvoicesController.findPixAsaas);

export default invoiceRoutes;
