import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../src/components/ui/button.jsx";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                    <div>
                        {/* Logo in Hero */}
                        <img src="/kart.png" alt="logo" className="w-48 h-auto mb-6 drop-shadow-lg" />
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>Welcome to Our Shop</h1>
                        <p className='text-xl mb-6 text-blue-100'>Discover amazing products at great prices.
                            Shop now and enjoy the best shopping experience!</p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Link to="/products">
                                <Button className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-3 rounded-full">
                                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>
                                Learn More
                            </Button>
                        </div>
                    </div>
                    <div className='relative'>
                        <img src="/brand.png" alt="Brand Product" className="w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300" />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Hero

