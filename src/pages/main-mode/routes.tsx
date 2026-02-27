import type { RouteObject } from 'react-router-dom'
import { MainModePage } from './ui/MainModePage'

export const routes: RouteObject[] = [
    { index: true, element: <MainModePage /> },
]
