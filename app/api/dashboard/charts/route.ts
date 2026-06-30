import { NextRequest } from 'next/server'
import { dashboardService } from '@/lib/services/dashboard.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(request.url)
    const chartType = searchParams.get('type') || 'revenue'

    logger.info('Dashboard Charts API', 'Fetching chart data', { type: chartType })

    let chartData

    switch (chartType) {
      case 'revenue':
        chartData = await dashboardService.getRevenueChart(session.user.id)
        break
      case 'productivity':
        chartData = await dashboardService.getTechnicianProductivity(session.user.id)
        break
      case 'orders':
        chartData = await dashboardService.getOrderStatus(session.user.id)
        break
      default:
        chartData = await dashboardService.getRevenueChart(session.user.id)
    }

    return apiResponse(chartData, 200, `${chartType} chart data fetched`)
  } catch (error) {
    logger.error('Dashboard Charts API', 'Error fetching chart', error)
    return handleApiError(error)
  }
}
