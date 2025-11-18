import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

const Hero = () => {

    const { isAuthenticated } = useAuthStore()



    //    RENDERING-STUFFS
    return (
        <section className="relative bg-[#fbfbfb] overflow-hidden">
            <div className=" absolute inset-0 bg-grid-white/[0.05] bg-size-[60px_60px]"></div>
            {/*  */}
            <div className=" relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight">NovaFlow — The Mind Behind Your Cashflow</h1>
                    <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">Let NovaFlow empower your business by turning invoicing into a smart, effortless, and seamless experience, letting you focus on growth while your cashflow stays in control.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {isAuthenticated ?
                            (<Link
                                className="bg-linear-to-r from-blue-950 to-blue-900 text-white px-8 py04 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform"
                                to={'/dashboard'}>Got to Dashboard</Link>)
                            : (<Link

                                to="/signup"
                                className="bg-linear-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform"
                            >
                                Get Started for Free
                            </Link>
                            )}
                        <a href="#features" className="border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transiton-all duration-200 hover:scale-105" >Learn More</a>

                    </div>
                </div>
                {/*  */}
                <div className="mt-12 relative max-w-5xl mx-auto">
                    <img src="" alt="" className=" rounded-2xl shadow-2xl shadow-gray-300 border-4 border-gray-200/20" />
                </div>
            </div>
            {/*  */}


        </section>
    )
}

export default Hero