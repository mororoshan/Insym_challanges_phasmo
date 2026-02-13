import type { RouteObject } from 'react-router-dom'
import { AboutPage } from './ui/AboutPage'

export const routes: RouteObject[] = [{ path: 'about', element: <AboutPage /> }]
