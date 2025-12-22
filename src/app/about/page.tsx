import React from 'react';
import { Header } from '@/frontend/components/layout/Header';
import Footer from '@/frontend/components/layout/Footer';
import { Users, Heart, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden text-white py-24 px-6 text-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-5xl font-black mb-6 tracking-tight">LoopLebanon</h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Reimagining community commerce in Lebanon. Connect, trade, and thrive together.
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <section className="py-20 px-6 max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                    <div className="max-w-3xl mx-auto mb-16 space-y-6">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In challenging times, community is everything. LoopLebanon was built to provide a resilient platform for local trade, bartering, and connection. We believe in the power of neighborly support and circular economy.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Whether you're looking to sell handmade goods, swap books, or offer services, Loop is your local gateway to the community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Community First</h3>
                            <p className="text-slate-500">Built by locals, for locals.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform">
                            <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                                <Heart className="h-8 w-8 text-rose-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Trusted Network</h3>
                            <p className="text-slate-500">Verified users & real connections.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform">
                            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <Shield className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Safe Trading</h3>
                            <p className="text-slate-500">Secure messaging & profiles.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform">
                            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                <Globe className="h-8 w-8 text-indigo-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Lebanon Wide</h3>
                            <p className="text-slate-500">Connecting all regions.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
