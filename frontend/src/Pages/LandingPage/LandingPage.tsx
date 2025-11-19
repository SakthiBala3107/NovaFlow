// import { useEffect, useState } from 'react'
import Faqs from '../../components/Landing/Faqs'
import Features from '../../components/Landing/Features'
import Footer from '../../components/Landing/Footer'
import Header from '../../components/Landing/Header'
import Hero from '../../components/Landing/Hero'
import Testimonals from '../../components/Landing/Testimonals'

const LandingPage = () => {


    // rENDERING-STUFFS
    return (
        <div className='bg-[#ffffff] text-gray-600'>
            <Header />
            <main >
                <Hero />
                <Features />
                <Testimonals />
                <Faqs />
                <Footer />
            </main>
        </div>
    )
}

export default LandingPage