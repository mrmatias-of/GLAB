import { NextRequest, NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from './route-handler'
import { RouteHandlerOptions } from './route-handler'

/**
 * Wrapper for dynamic routes ([id]/route.ts) that need param access
 * 
 * Usage:
 * export const GET = withDynamicRoute(handleGET, options)
 * export const PUT = withDynamicRoute(handlePUT, options)
 * export const DELETE = withDynamicRoute(handleDELETE, options)
 * 
 * Then call with:
 * export async function GET(req, { params }) {
 *   return GET(req)
 * }
 */

export function withDynamicRoute(
  handler: (context: RequestContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  const wrappedHandler = async (context: RequestContext) => {
    return await handler(context)
  }

  return withMiddleware(wrappedHandler, options)
}

/**
 * Helper to create dynamic route exports
 */
export function createDynamicRouteExports(handlers: {
  GET?: (context: RequestContext) => Promise<NextResponse>
  POST?: (context: RequestContext) => Promise<NextResponse>
  PUT?: (context: RequestContext) => Promise<NextResponse>
  DELETE?: (context: RequestContext) => Promise<NextResponse>
  PATCH?: (context: RequestContext) => Promise<NextResponse>
}, options: Partial<Record<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', RouteHandlerOptions>> = {}) {
  const exports: any = {}

  if (handlers.GET) {
    const wrapped = withDynamicRoute(handlers.GET, options.GET)
    exports.GET = async (req: NextRequest, { params }: { params: Promise<any> }) => {
      const resolvedParams = await params
      const reqWithParams = req.clone() as any
      reqWithParams._params = resolvedParams
      return wrapped(req)
    }
  }

  if (handlers.POST) {
    const wrapped = withDynamicRoute(handlers.POST, options.POST)
    exports.POST = async (req: NextRequest, { params }: { params: Promise<any> }) => {
      const resolvedParams = await params
      const reqWithParams = req.clone() as any
      reqWithParams._params = resolvedParams
      return wrapped(req)
    }
  }

  if (handlers.PUT) {
    const wrapped = withDynamicRoute(handlers.PUT, options.PUT)
    exports.PUT = async (req: NextRequest, { params }: { params: Promise<any> }) => {
      const resolvedParams = await params
      const reqWithParams = req.clone() as any
      reqWithParams._params = resolvedParams
      return wrapped(req)
    }
  }

  if (handlers.DELETE) {
    const wrapped = withDynamicRoute(handlers.DELETE, options.DELETE)
    exports.DELETE = async (req: NextRequest, { params }: { params: Promise<any> }) => {
      const resolvedParams = await params
      const reqWithParams = req.clone() as any
      reqWithParams._params = resolvedParams
      return wrapped(req)
    }
  }

  if (handlers.PATCH) {
    const wrapped = withDynamicRoute(handlers.PATCH, options.PATCH)
    exports.PATCH = async (req: NextRequest, { params }: { params: Promise<any> }) => {
      const resolvedParams = await params
      const reqWithParams = req.clone() as any
      reqWithParams._params = resolvedParams
      return wrapped(req)
    }
  }

  return exports
}
