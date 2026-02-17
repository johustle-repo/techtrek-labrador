import { useEffect, useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

const TESTIMONIALS = [
    {
        quote: "The centralized data dashboard allows us to track visitor influx and update attraction details in real-time. It's a game changer for Labrador.",
        author: 'Municipal Tourism Office',
        role: 'Administrator',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
        badge: 'LGU',
    },
    {
        quote: "TechTrek allowed our small homestay to reach tourists we never could before. It's a vital tool for local business growth.",
        author: 'Ricardo Dalisay',
        role: 'Local Business Owner',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
        badge: 'BO',
    },
    {
        quote: 'Creating an account opened up a whole new way to experience Labrador. The interactive maps made finding hidden beaches incredibly easy.',
        author: 'Maria Santos',
        role: 'Tourist & Verified User',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070&auto=format&fit=crop',
        badge: 'TV',
    },
];

export default function ForgotPassword({ status }: { status?: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

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
            <Head title="Forgot password - TechTrek Labrador" />

            <div className="min-h-screen w-full lg:grid lg:grid-cols-2 font-['Instrument_Sans']">
                <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
                    <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                        <img
                            key={activeItem.image}
                            src={activeItem.image}
                            alt="Labrador Scene"
                            className={`h-full w-full object-cover opacity-50 transition-transform duration-[10000ms] ease-linear transform ${isAnimating ? 'scale-100 opacity-40' : 'scale-110 opacity-50'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-slate-900/50 to-slate-900/30" />
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(#ccfbf1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                        />
                    </div>

                    <div className="relative z-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/25">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <span>
                                TechTrek <span className="font-light text-teal-200">Labrador</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-20 max-w-sm">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-teal-200 backdrop-blur-md">
                            Account Recovery
                        </div>
                        <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-sm">We will send a secure reset link to your email.</h2>
                    </div>

                    <div className="relative z-20">
                        <div
                            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                        >
                            <div className="absolute -right-4 -top-4 text-9xl font-serif text-white/5">"</div>
                            <blockquote className="relative space-y-4 text-left">
                                <p className="text-lg font-medium leading-relaxed text-slate-100">"{activeItem.quote}"</p>
                                <footer className="flex items-center gap-4 pt-2">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 p-[2px]">
                                        <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">{activeItem.badge}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{activeItem.author}</div>
                                        <div className="text-xs text-teal-200/80">{activeItem.role}</div>
                                    </div>
                                </footer>
                            </blockquote>
                        </div>

                        <div className="flex gap-2 mt-4 justify-start">
                            {TESTIMONIALS.map((_, idx) => (
                                <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-teal-400' : 'w-2 bg-white/20'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center justify-center bg-slate-50 p-8 lg:p-12">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] relative z-10">
                        <div className="flex flex-col space-y-2 text-left">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forgot password</h1>
                            <p className="text-sm text-slate-500">Enter your email to receive a password reset link.</p>
                        </div>

                        {status && (
                            <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-100 flex items-center gap-2">
                                {status}
                            </div>
                        )}

                        <Form {...email.form()} className="grid gap-5">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-slate-700 font-semibold">
                                                Email address
                                            </Label>
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
                                                    autoComplete="email"
                                                    autoFocus
                                                    placeholder="name@example.com"
                                                    required
                                                    className="pl-10 h-11 border-slate-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all hover:border-teal-300 rounded-lg"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        <Button
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-base mt-2"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            {processing && <Spinner className="mr-2 h-4 w-4 text-white" />}
                                            Email password reset link
                                        </Button>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-teal-600 transition-colors group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Back to Login
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
