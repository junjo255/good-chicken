// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// // authorizenet SDK is CommonJS
// const sdk = require('authorizenet');
// const { APIContracts, APIControllers } = sdk;
//
//
// const LOGIN_ID = process.env.AUTHORIZENET_API_LOGIN_ID!;
// const TXN_KEY = process.env.AUTHORIZENET_TRANSACTION_KEY!;
//
//
// export type Opaque = { dataDescriptor: string; dataValue: string };
//
//
// export async function captureWithOpaque(amount: number, opaque: Opaque) {
//     const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
//     merchantAuthenticationType.setName(LOGIN_ID);
//     merchantAuthenticationType.setTransactionKey(TXN_KEY);
//
//
//     const opaqueData = new APIContracts.OpaqueDataType();
//     opaqueData.setDataDescriptor(opaque.dataDescriptor);
//     opaqueData.setDataValue(opaque.dataValue);
//
//
//     const paymentType = new APIContracts.PaymentType();
//     paymentType.setOpaqueData(opaqueData);
//
//
//     const txnRequest = new APIContracts.TransactionRequestType();
//     txnRequest.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
//     txnRequest.setAmount(amount / 100); // Authorize.Net expects dollars
//     txnRequest.setPayment(paymentType);
//
//
//     const createRequest = new APIContracts.CreateTransactionRequest();
//     createRequest.setMerchantAuthentication(merchantAuthenticationType);
//     createRequest.setTransactionRequest(txnRequest);
//
//
//     const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
//
//
//     const env = (process.env.AUTHORIZENET_ENV || 'sandbox').toLowerCase();
//     if (env === 'production') ctrl.setEnvironment('https://api2.authorize.net/xml/v1/request.api');
//     else ctrl.setEnvironment('https://apitest.authorize.net/xml/v1/request.api');
//
//
//     const response = await new Promise<any>((resolve, reject) => {
//         try {
//             ctrl.execute(() => {
//                 const raw = ctrl.getResponse();
//                 const resp = new APIContracts.CreateTransactionResponse(raw);
//                 resolve(resp);
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
//
//
//     const resultCode = response.getMessages().getResultCode();
//     const txn = response.getTransactionResponse();
//     const transId = txn?.getTransId?.();
//     const responseCode = txn?.getResponseCode?.();
//     const authCode = txn?.getAuthCode?.();
//
//
//     return { resultCode, responseCode, authCode, transId, raw: response };
// }