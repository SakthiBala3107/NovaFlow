import { useEffect, useState } from 'react'
import Header from '../../components/Landing/Header'

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false)


    const isAuthenticated = false
    const user = { name: 'Azula', email: 'princessAzula@gmail.com' }
    const logout = () => { }

    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 1) }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)

    }, [])

    // rENDERING-STUFFS
    return (
        <div className='bg-[#ffffff] text-gray-600'>
            <Header />
        </div>
    )
}

export default LandingPage