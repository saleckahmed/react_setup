import React from 'react'

export default function HomePageContent({ title = "Welcome to Our Platform", subtitle = "Discover amazing products and services designed just for you" }) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4"       >
            <div className="text-center max-w-2xl">
                <h1 className="text-6xl md:text-7xl font- text-blue-600 mb-4" >
                    {title}
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                    {subtitle}
                </p>

            </div>
        </div>
    );
}