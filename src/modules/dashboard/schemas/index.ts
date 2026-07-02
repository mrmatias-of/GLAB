import { z } from 'zod'

export const DateRangeSchema = z.object({
  dataInicio: z.string().date().optional(),
  dataFim: z.string().date().optional(),
  mes: z.number().min(1).max(12).optional(),
  ano: z.number().min(2000).optional(),
})

export type DateRange = z.infer<typeof DateRangeSchema>
