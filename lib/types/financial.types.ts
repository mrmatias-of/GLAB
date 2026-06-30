export enum FinancialEntryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum PaymentMethod {
  PIX = 'pix',
  BOLETO = 'boleto',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  OTHERS = 'others',
}

export enum FinancialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface CostCenter {
  id: string
  companyId: string
  name: string
  description?: string
  budget?: number
  spent: number
  active: boolean
}

export interface AccountPlan {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parent?: string
  active: boolean
}

export interface FinancialEntry {
  id: string
  companyId: string
  description: string
  amount: number
  type: FinancialEntryType
  category: string
  costCenter?: string
  paymentMethod: PaymentMethod
  status: FinancialStatus
  dueDate: Date
  paidDate?: Date
  orderId?: string
  ordinalNumber?: string
  installment?: number
  totalInstallments?: number
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextOccurrence?: Date
  interest?: number
  fine?: number
  discount?: number
  notes?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Installment {
  number: number
  dueDate: Date
  paidDate?: Date
  amount: number
  paidAmount?: number
  status: FinancialStatus
  discount?: number
  interest?: number
  fine?: number
}

export interface CashFlow {
  date: Date
  totalIncome: number
  totalExpense: number
  balance: number
  forecast?: number
}

export interface DREReport {
  period: string
  revenue: number
  costOfGoods: number
  grossProfit: number
  operationalExpenses: number
  operationalProfit: number
  otherIncomeExpense: number
  netProfit: number
  profitMargin: number
}

export interface AccountReconciliation {
  id: string
  companyId: string
  accountId: string
  bankBalance: number
  systemBalance: number
  difference: number
  reconciliedAt?: Date
  createdAt: Date
  notes?: string
}

export interface Commission {
  id: string
  companyId: string
  technicianId: string
  period: string
  baseAmount: number
  percentage: number
  bonusAmount?: number
  totalAmount: number
  status: FinancialStatus
  paidAt?: Date
}

export interface CreditControl {
  id: string
  companyId: string
  clientId: string
  creditLimit: number
  usedCredit: number
  availableCredit: number
  daysOverdue: number
  overdueDays: number[]
  status: 'active' | 'suspended' | 'cancelled'
}
