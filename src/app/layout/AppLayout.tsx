import { Header } from '@/widgets/Header'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
    return (
        <div className="flex min-h-screen w-full flex-col p-1">
            <header className="shrink-0">
                <Header />
            </header>
            <main className="mx-auto w-5/6 flex-1 md:w-3/4">
                <Outlet />
            </main>
        </div>
    )
}
