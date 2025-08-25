
import { TransactionData } from './types';

export const NON_FRAUD_EXAMPLE: TransactionData = {
  v10: '-0.255425',
  v12: '-0.617801',
  v14: '-0.311169',
  v17: '0.207971',
  amount: '1.98',
};

export const FRAUD_EXAMPLE: TransactionData = {
  v10: '-2.770083',
  v12: '-2.756053',
  v14: '-4.609969',
  v17: '-6.665951',
  amount: '1.00',
};
