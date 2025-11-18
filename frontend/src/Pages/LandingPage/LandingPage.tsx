// import { useEffect, useState } from 'react'
import Features from '../../components/Landing/Features'
import Header from '../../components/Landing/Header'
import Hero from '../../components/Landing/Hero'

const LandingPage = () => {


    // rENDERING-STUFFS
    return (
        <div className='bg-[#ffffff] text-gray-600'>
            <Header />
            <main className='mb-[100vh]'>
                <Hero />
                <Features />
            </main>
        </div>
    )
}

export default LandingPage