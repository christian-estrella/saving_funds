export default interface ListBorrowHistorySpec {
  id: number;
  requestedAmount: number;
  totalDue: number;
  totalPaid: number;
  numberPayments: number;
  paymentsMade: number;
  period: number;
  isFortnightly: boolean;
  resolution: string;
  createdAt: string;
}