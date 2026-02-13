import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher'

type Props = {}

export function Header({}: Props) {
    return (
        <div className="w-full">
            <nav className="flex items-center gap-4 px-4 py-3">
                <div className="flex flex-1 gap-4">
                    <Link to="/" className="text-inherit hover:underline">
                        Home
                    </Link>
                    <Link to="/about" className="text-inherit hover:underline">
                        About
                    </Link>
                    <Link to="/settings" className="text-inherit hover:underline">
                        Settings
                    </Link>
                </div>
                <LanguageSwitcher />
            </nav>
        </div>
    )
}
