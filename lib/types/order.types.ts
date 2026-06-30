export enum OrderStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived',
}

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  completed: boolean
  required: boolean
  category?: string
  order: number
}

export interface OrderChecklist {
  id: string
  orderId: string
  items: ChecklistItem[]
  completedAt?: Date
}

export interface OrderAttachment {
  id: string
  orderId: string
  type: 'photo' | 'video' | 'audio' | 'document'
  url: string
  fileName: string
  size: number
  uploadedAt: Date
  uploadedBy: string
}

export interface OrderSignature {
  id: string
  orderId: string
  type: 'technician' | 'client'
  signatureData: string
  signedAt: Date
  signedBy: string
}

export interface OrderTimeline {
  id: string
  orderId: string
  event: string
  description: string
  actor: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface OrderComment {
  id: string
  orderId: string
  content: string
  isInternal: boolean
  author: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
  mentions?: string[]
}

export interface OrderGuarantee {
  id: string
  orderId: string
  type: 'service' | 'parts'
  description: string
  expiresAt: Date
  partNumber?: string
  serialNumber?: string
}

export interface OrderTechnicalReport {
  id: string
  orderId: string
  initialAnalysis: string
  diagnosis: string
  solution: string
  partsUsed: Array<{
    name: string
    quantity: number
    serialNumber?: string
  }>
  labourHours: number
  notes?: string
  generatedAt: Date
  generatedBy: string
}

export interface Order {
  id: string
  companyId: string
  number: string
  clientId: string
  equipmentDescription: string
  issue: string
  status: OrderStatus
  priority: OrderPriority
  priority_urgency?: string
  assignedTo?: string
  startedAt?: Date
  completedAt?: Date
  expectedCompletionDate?: Date
  estimatedHours?: number
  actualHours?: number
  customFields?: Record<string, any>
  tags?: string[]
  checklist?: OrderChecklist
  attachments?: OrderAttachment[]
  signatures?: OrderSignature[]
  timeline?: OrderTimeline[]
  comments?: OrderComment[]
  guarantee?: OrderGuarantee
  technicalReport?: OrderTechnicalReport
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}
