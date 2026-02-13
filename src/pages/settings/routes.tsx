import type { RouteObject } from 'react-router-dom'
import { SettingsPage } from './ui/SettingsPage'

export const routes: RouteObject[] = [{ path: 'settings', element: <SettingsPage /> }]
