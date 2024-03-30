export interface Loan {
  id: string,
  name: string,
  amount: number,
  interestRate: number,
  payDate: string,
  isPayed?: boolean,
  nameInitials?: string,
}