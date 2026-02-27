import { Outlet } from 'react-router'
import Navbar from './Navbar'

const Layout = () => {
    return (
        <div className="w-[90%] h-screen flex flex-col mx-auto">
            <Navbar />
            <div className="flex-1 flex items-center justify-center ">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout