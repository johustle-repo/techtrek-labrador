import { useState, useEffect } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

// Defined the Props type here
type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const TESTIMONIALS = [
    {
        quote: "The centralized data dashboard allows us to track visitor influx and update attraction details in real-time. It's a game changer for Labrador.",
        author: "Municipal Tourism Office",
        role: "Administrator",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", 
        badge: "LGU"
    },
    {
        quote: "TechTrek allowed our small homestay to reach tourists we never could before. It's a vital tool for local business growth.",
        author: "Ricardo Dalisay",
        role: "Local Business Owner",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", 
        badge: "BO"
    },
    {
        quote: "Creating an account opened up a whole new way to experience Labrador. The interactive maps made finding hidden beaches incredibly easy.",
        author: "Maria Santos",
        role: "Tourist & Verified User",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070&auto=format&fit=crop", 
        badge: "TV"
    }
];

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    // Form States
    const [showPassword, setShowPassword] = useState(false);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Rotate testimonials every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true); // Start fade out
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
                setIsAnimating(false); // Start fade in
            }, 500); // Wait for fade out to finish
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const activeItem = TESTIMONIALS[currentIndex];

    return (
        <>
            <Head title="Log in - TechTrek Labrador" />

            <div className="auth-page min-h-[100svh] w-full overflow-y-auto lg:grid lg:grid-cols-2 font-['Instrument_Sans']">
                
                {/* --- LEFT COLUMN: Rotating Tech-Tourism Visual --- */}
                <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
                    
                    {/* Background Image with Transition */}
                    <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                        <img 
                            key={activeItem.image}
                            src={activeItem.image} 
                            alt="Labrador Scene" 
                            className={`h-full w-full object-cover opacity-50 transition-transform duration-[10000ms] ease-linear transform ${isAnimating ? 'scale-100 opacity-40' : 'scale-110 opacity-50'}`}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-slate-900/50 to-slate-900/30" />
                        
                        {/* Tech Grid Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20" 
                             style={{ backgroundImage: 'radial-gradient(#ccfbf1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                        </div>
                    </div>
                    
                    {/* Top Row: Logo */}
                    <div className="relative z-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/25">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <span>TechTrek <span className="font-light text-teal-200">Labrador</span></span>
                        </Link>
                    </div>

                    {/* Middle: Feature Highlight */}
                    <div className="relative z-20 max-w-sm">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-teal-200 backdrop-blur-md">
                            Smart Tourism Initiative
                        </div>
                        <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-sm">
                            Managing local tourism has never been this seamless.
                        </h2>
                    </div>

                    {/* Bottom: Responsive Quote Card */}
                    <div className="relative z-20">
                        <div 
                            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                        >
                            <div className="absolute -right-4 -top-4 text-9xl font-serif text-white/5">”</div>
                            
                            {/* Quote Content */}
                            <blockquote className="relative space-y-4 text-left">
                                <p className="text-lg font-medium leading-relaxed text-slate-100">
                                    "{activeItem.quote}"
                                </p>
                                <footer className="flex items-center gap-4 pt-2">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 p-[2px]">
                                        <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                            {activeItem.badge}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{activeItem.author}</div>
                                        <div className="text-xs text-teal-200/80">{activeItem.role}</div>
                                    </div>
                                </footer>
                            </blockquote>
                        </div>

                        {/* Progress Indicators */}
                        <div className="flex gap-2 mt-4 justify-start">
                            {TESTIMONIALS.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-teal-400' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Login Form --- */}
                <div className="relative flex min-h-[100svh] items-center justify-center bg-gradient-to-b from-teal-50 via-slate-50 to-white px-4 py-6 sm:px-6 sm:py-8 lg:bg-slate-50 lg:p-12">
                    <div className="relative z-10 mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6 dark:border dark:border-emerald-800/65 dark:bg-emerald-950/70 dark:shadow-xl dark:shadow-emerald-950/40 dark:backdrop-blur-xl lg:max-w-[430px] lg:rounded-2xl lg:bg-white/95 lg:p-6 lg:shadow-lg lg:ring-1">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:space-y-7">
                        <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-lg lg:hidden">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
                                alt="Labrador coast"
                                className="h-28 w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-emerald-700/30" />
                            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">TechTrek Labrador</p>
                                <p className="text-sm font-bold">Tourism Portal Access</p>
                            </div>
                        </div>
                        
                        {/* Header */}
                        <div className="flex flex-col space-y-2 text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Welcome back
                            </h1>
                            <p className="text-sm text-slate-500">
                                Please sign in to your account to continue.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-100 flex items-center gap-2">
                                {status}
                            </div>
                        )}

                        {/* Form */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="grid gap-4 sm:gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4">
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
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    className="pl-10 h-11 border-slate-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all hover:border-teal-300 rounded-lg"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Input with Toggle */}
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                                            </div>
                                            <div className="relative group">
                                                {/* Left Icon (Lock) */}
                                                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>

                                                {/* Input Field */}
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="••••••••"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    className="pl-10 pr-10 h-11 border-slate-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all hover:border-teal-300 rounded-lg"
                                                />

                                                {/* Right Icon (Eye Toggle) */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-teal-600 focus:outline-none transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.251 10.251 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            
                                            <div className="flex justify-end">
                                                {canResetPassword && (
                                                    <Link
                                                        href={request()}
                                                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="my-2 flex items-start gap-2.5 sm:items-center">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 border-slate-300 text-white rounded-[4px] h-4 w-4"
                                            />
                                            <Label htmlFor="remember" className="cursor-pointer select-none text-sm leading-normal font-medium text-slate-600">
                                                Remember me for 30 days
                                            </Label>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full rounded-xl bg-teal-600 py-5 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] hover:bg-teal-700 active:scale-[0.98] sm:py-6"
                                            tabIndex={4}
                                            disabled={processing}
                                        >
                                            {processing && <Spinner className="mr-2 h-4 w-4 text-white" />}
                                            Sign In
                                        </Button>
                                    </div>

                                    {/* Footer: Create Account + Home Link */}
                                    <div className="space-y-4 pt-1 text-center sm:pt-2">
                                        {canRegister && (
                                            <p className="text-sm text-slate-600">
                                                Don't have an account?{' '}
                                                <Link
                                                    href="/register"
                                                    className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                                                    tabIndex={5}
                                                >
                                                    Create an account
                                                </Link>
                                            </p>
                                        )}
                                        
                                        <Link 
                                            href="/" 
                                            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-teal-600 transition-colors group mt-2"
                                        >
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
                </div>
            </div>
        </>
    );
}
