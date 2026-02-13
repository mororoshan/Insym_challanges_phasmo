import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'

const pageRouteModules = import.meta.glob<{ routes: RouteObject[] }>(
    '../../pages/*/routes.tsx',
    { eager: true }
)

const childRoutes = Object.values(pageRouteModules).flatMap((m) => m?.routes ?? [])

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: childRoutes,
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}
