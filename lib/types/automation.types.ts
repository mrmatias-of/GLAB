export enum TriggerType {
  ORDER_CREATED = 'order_created',
  ORDER_COMPLETED = 'order_completed',
  ORDER_DELAYED = 'order_delayed',
  CLIENT_CREATED = 'client_created',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_OVERDUE = 'payment_overdue',
  LOW_STOCK = 'low_stock',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  SEND_WHATSAPP = 'send_whatsapp',
  CREATE_TASK = 'create_task',
  CREATE_LEAD = 'create_lead',
  UPDATE_ORDER = 'update_order',
  CREATE_FINANCIAL_ENTRY = 'create_financial_entry',
  SEND_NOTIFICATION = 'send_notification',
  CALL_WEBHOOK = 'call_webhook',
  RUN_SCRIPT = 'run_script',
  GENERATE_PDF = 'generate_pdf',
  ARCHIVE_ORDER = 'archive_order',
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_EQUAL = 'greater_equal',
  LESS_EQUAL = 'less_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IN = 'in',
  NOT_IN = 'not_in',
  EXISTS = 'exists',
  NOT_EXISTS = 'not_exists',
}

export interface Condition {
  field: string
  operator: ConditionOperator
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface Action {
  type: ActionType
  parameters: Record<string, any>
  delay?: number // em minutos
  delayUnit?: 'minutes' | 'hours' | 'days'
}

export interface AutomationRule {
  id: string
  companyId: string
  name: string
  description?: string
  enabled: boolean
  trigger: {
    type: TriggerType
    conditions?: Condition[]
  }
  actions: Action[]
  order: number
  executedCount: number
  lastExecutedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AutomationExecution {
  id: string
  automationId: string
  triggeredBy: string
  trigger: any
  actions: Array<{
    type: ActionType
    status: 'pending' | 'executing' | 'success' | 'failed'
    result?: any
    error?: string
  }>
  status: 'success' | 'partial' | 'failed'
  startedAt: Date
  completedAt: Date
  logs: Array<{
    timestamp: Date
    level: 'info' | 'warning' | 'error'
    message: string
  }>
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  trigger: TriggerType
  actions: Action[]
  conditions?: Condition[]
  icon?: string
  featured: boolean
}
