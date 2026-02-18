import type { RouteObject } from 'react-router-dom'
import { ROUTE_PATHS } from '@/shared/config/routes'
import { SettingsPage } from './ui/SettingsPage'

export const routes: RouteObject[] = [
    { path: ROUTE_PATHS.SETTINGS, element: <SettingsPage /> },
]
