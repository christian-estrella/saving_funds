export default interface SavingFundListSpec {
  id: number;
  associateName: string;
  agreementName: string;
  annualRate: number;
  salary: number;
  openingBalance: number;
  balance: number;
  accruedInterest: number;
  contributions: number;
  total: number;
  withdrawals: number;
  isFortnightly: boolean;
}