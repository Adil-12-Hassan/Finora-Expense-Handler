import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = () => {
    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="lg:ml-60 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            {/* Mobile bottom nav */}
            <Navbar />
        </div>
    )
}

export default Layout