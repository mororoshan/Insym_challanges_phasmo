/** Route path segments used in router children (relative to layout). */
export const ROUTE_PATHS = {
    MAIN_MODE: 'main-mode',
    SETTINGS: 'settings',
} as const

/** Full path strings for use in Link `to` and navigation. */
export const ROUTES = {
    HOME: '/',
    MAIN_MODE: `/${ROUTE_PATHS.MAIN_MODE}`,
    SETTINGS: `/${ROUTE_PATHS.SETTINGS}`,
} as const
