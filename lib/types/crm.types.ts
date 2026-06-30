export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERESTED = 'interested',
  NEGOTIATING = 'negotiating',
  WON = 'won',
  LOST = 'lost',
}

export enum DealStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSE = 'close',
  WON = 'won',
  LOST = 'lost',
}

export interface Lead {
  id: string
  companyId: string
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: LeadStatus
  source: string
  score: number
  tags?: string[]
  lastContact?: Date
  nextFollowUp?: Date
  notes?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Deal {
  id: string
  companyId: string
  leadId: string
  title: string
  description?: string
  value: number
  probability: number
  stage: DealStage
  expectedCloseDate: Date
  owner: string
  tags?: string[]
  activities: Activity[]
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'message' | 'note'
  description: string
  dueDate?: Date
  completedAt?: Date
  createdBy: string
  createdAt: Date
}

export interface Segment {
  id: string
  companyId: string
  name: string
  criteria: Record<string, any>
  clientCount: number
}

export interface Campaign {
  id: string
  companyId: string
  name: string
  description?: string
  type: 'email' | 'sms' | 'whatsapp' | 'multi'
  targetSegment: string
  status: 'draft' | 'scheduled' | 'running' | 'completed'
  startDate: Date
  endDate?: Date
  budget?: number
  spent?: number
  metrics: CampaignMetrics
}

export interface CampaignMetrics {
  sent: number
  opened: number
  clicked: number
  converted: number
  bounced: number
  openRate: number
  clickRate: number
  conversionRate: number
}
