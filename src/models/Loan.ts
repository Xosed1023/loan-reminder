export interface Loan {
  id: string,
  name: string,
  amount: number,
  interestRate: number,
  payDate: string, // Fecha acordada para el pago
  datePaid?: string, // Fecha en la que paga
  isPayed?: boolean,
  nameInitials?: string,
  concept: string,
  type: string
}