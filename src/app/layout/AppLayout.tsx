import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <main className="w-3/4 mx-auto">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
