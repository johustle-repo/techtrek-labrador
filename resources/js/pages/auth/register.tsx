import { useState, useEffect } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

// Shared consistency with Login page for rotating testimonials
const TESTIMONIALS = [
    {
        quote: "Creating an account opened up a whole new way to experience Labrador. The interactive maps made finding hidden beaches incredibly easy.",
        author: "Maria Santos",
        role: "Tourist & Verified User",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", 
        badge: "TV"
    },
    {
        quote: "TechTrek allowed our small homestay to reach tourists we never could before. It's a vital tool for local business growth.",
        author: "Ricardo Dalisay",
        role: "Local Business Owner",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", 
        badge: "BO"
    },
    {
        quote: "A centralized platform for all our tourism data ensures every visitor gets accurate, real-time information about our festivals.",
        author: "LGU Tourism Office",
        role: "Administrator",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070&auto=format&fit=crop", 
        badge: "AD"
    }
];

export default function Register() {
    // Form States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Rotate testimonials every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
                setIsAnimating(false);
            }, 500);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const activeItem = TESTIMONIALS[currentIndex];

    return (
        <>
            <Head title="Register - TechTrek Labrador" />

            <div className="min-h-screen w-full lg:grid lg:grid-cols-2 font-['Instrument_Sans']">
                
                {/* --- LEFT COLUMN: Form Section (Aligned with Login) --- */}
                <div className="relative flex items-center justify-center bg-slate-50 p-8 lg:p-12 order-last lg:order-first">
                    <div className="absolute top-0 left-0 -mt-20 -ml-20 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

                    <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] relative z-10">
                        <div className="flex flex-col space-y-2 text-left">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h1>
                            <p className="text-sm text-slate-500">Join TechTrek to explore Labrador's hidden gems.</p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="grid gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4 text-left">
                                        {/* Name Input */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                                    </svg>
                                                </div>
                                                <Input id="name" name="name" type="text" placeholder="Juan Dela Cruz" required autoFocus className="pl-10 h-11 border-slate-200 focus:ring-teal-500 rounded-lg" />
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        {/* Email Input */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email address</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                                    </svg>
                                                </div>
                                                <Input id="email" name="email" type="email" placeholder="name@example.com" required className="pl-10 h-11 border-slate-200 focus:ring-teal-500 rounded-lg" />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Input */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required className="pl-10 pr-10 h-11 border-slate-200 focus:ring-teal-500 rounded-lg" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-teal-600 transition-colors">
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.251 10.251 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Confirm Password Input */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation" className="text-slate-700 font-semibold">Confirm Password</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <Input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" required className="pl-10 pr-10 h-11 border-slate-200 bg-white shadow-sm focus:ring-teal-500 rounded-lg" />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-teal-600 transition-colors">
                                                    {showConfirmPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.251 10.251 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-teal-600/20 text-base mt-2" disabled={processing}>
                                            {processing && <Spinner className="mr-2 h-4 w-4 text-white" />} Create Account
                                        </Button>
                                    </div>

                                    <div className="space-y-4 text-center pt-2">
                                        <p className="text-sm text-slate-600">
                                            Already have an account? <Link href={login()} className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors">Log in</Link>
                                        </p>
                                        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-teal-600 transition-colors group mt-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Return to Homepage
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Visual Design Aligned with Logo --- */}
                <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex order-first lg:order-last">
                    <div className="absolute inset-0">
                        <img key={activeItem.image} src={activeItem.image} className={`h-full w-full object-cover transition-all duration-[1000ms] ${isAnimating ? 'opacity-30 scale-100' : 'opacity-50 scale-105'}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-slate-900/50 to-slate-900/30" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ccfbf1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    </div>
                    
                    <div className="relative z-20">
                        <Link href="/" className="inline-flex items-center gap-3 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/25">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <span>TechTrek <span className="font-light text-teal-200">Labrador</span></span>
                        </Link>
                    </div>

                    <div className="relative z-20 text-left">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider text-teal-200 backdrop-blur-md">
                            Smart Tourism Initiative
                        </div>
                        <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-sm max-w-lg">
                            Managing local tourism has never been this seamless.
                        </h2>
                    </div>

                    <div className="relative z-20">
                        <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            <div className="absolute -right-4 -top-4 text-9xl font-serif text-white/5">”</div>
                            <blockquote className="relative space-y-4 text-left">
                                <p className="text-lg font-medium leading-relaxed text-slate-100 italic">"{activeItem.quote}"</p>
                                <footer className="flex items-center gap-4 pt-2">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 p-[2px]">
                                        <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white uppercase">{activeItem.badge}</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-white">{activeItem.author}</div>
                                        <div className="text-xs text-teal-200/80">{activeItem.role}</div>
                                    </div>
                                </footer>
                            </blockquote>
                        </div>
                        <div className="flex gap-2 mt-6 justify-start">
                            {TESTIMONIALS.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-teal-400' : 'w-3 bg-white/20'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}