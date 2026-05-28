import React from 'react'
import { ShoppingBag, Truck, Shield, CreditCard } from 'lucide-react'

const Features = () => {
  return (
    <section className="py-16 bg-pink-50">
        <div className='max-w-7xl mx-auto px-4'>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Why Choose Us
            </h2>
            <div className='grid md:grid-cols-4 gap-8'>
                {/* Feature 1 */}
                <div className='text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                    <ShoppingBag style={{ color: "#db2777" }} className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Easy Shopping</h3>
                    <p className="text-gray-600">Browse and purchase products with ease</p>
                </div>
                
                {/* Feature 2 */}
                <div className='text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                    <Truck style={{ color: "#db2777" }} className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">Get your products delivered quickly</p>
                </div>
                
                {/* Feature 3 */}
                <div className='text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                    <Shield style={{ color: "#db2777" }} className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                    <p className="text-gray-600">Safe and secure payment options</p>
                </div>
                
                {/* Feature 4 */}
                <div className='text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                    <CreditCard style={{ color: "#db2777" }} className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                    <p className="text-gray-600">Get the best deals on all products</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Features

