import type { RouteObject } from 'react-router-dom'
import { ROUTE_PATHS } from '@/shared/config/routes'
import { MainModePage } from './ui/MainModePage'

export const routes: RouteObject[] = [
    { path: ROUTE_PATHS.MAIN_MODE, element: <MainModePage /> },
]
