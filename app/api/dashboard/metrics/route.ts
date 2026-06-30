import { NextRequest } from 'next/server'
import { dashboardService } from '@/lib/services/dashboard.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    logger.info('Dashboard API', 'Fetching metrics', { userId: session.user.id })

    const metrics = await dashboardService.getMetrics(session.user.id)

    return apiResponse(metrics, 200, 'Metrics fetched successfully')
  } catch (error) {
    logger.error('Dashboard API', 'Error fetching metrics', error)
    return handleApiError(error)
  }
}
