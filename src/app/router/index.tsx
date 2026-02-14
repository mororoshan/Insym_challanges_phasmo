import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage'
import { AppLayout } from '../layout/AppLayout'

const pageRouteModules = import.meta.glob<{ routes: RouteObject[] }>(
    '../../pages/*/routes.tsx',
    { eager: true }
)

const childRoutes: RouteObject[] = [
    ...Object.values(pageRouteModules).flatMap((m) => m?.routes ?? []),
    { path: '*', element: <NotFoundPage /> },
]

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
