import { Link } from 'react-router-dom'

type Props = {}

export function Header({}: Props) {
    return (
        <div className="w-full">
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/settings">Settings</Link>
            </nav>
        </div>
    )
}
