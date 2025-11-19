import { FileText, } from "lucide-react"
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

<div className="flex gap-4">
    <FaGithub size={24} />
    <FaTwitter size={24} />
    <FaLinkedin size={24} />
</div>

import { Link } from "react-router-dom"

type FooterLinkProps = {
    href?: string, to?: string, children?: React.ReactNode
}


const FooterLink = ({ to, children }: FooterLinkProps) => {
    const className = "block text-gray-400 hover:text-white transition-colors duration-200"

    if (to) {
        <Link to={to} className={className} >{children}</Link>
    }

    return (
        <a href={to} className={className} >{children}</a>


    )

}

const SocialLink = ({ href, children }: FooterLinkProps) => {

    return (
        <a
            href={href}
            className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    )
}



// primary-comp
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-blue-950 rounded-md flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold">NovaFlow</span>
                        </Link>

                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            The simplest way to create and send professional invoices.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><FooterLink href="#features">Features</FooterLink></li>
                            <li><FooterLink href="#testimonials">Testimonials</FooterLink></li>
                            <li><FooterLink href="#faq">FAQ</FooterLink></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><FooterLink to="/about">About Us</FooterLink></li>
                            <li><FooterLink to="/contact">Contact</FooterLink></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-8 mt-16">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400">
                            &copy; 2025 NovaFlow AI Invoice Sphere. All rights reserved.
                        </p>

                        <div className="flex space-x-4">
                            <SocialLink href="#">
                                <FaTwitter className="w-5 h-5" />
                            </SocialLink>
                            <SocialLink href="#">
                                <FaGithub className="w-5 h-5" />
                            </SocialLink>
                            <SocialLink href="#">
                                <FaLinkedin className="w-5 h-5" />
                            </SocialLink>
                        </div>

                    </div>
                </div>

            </div>
        </footer>
    );
};


export default Footer