import { Head, Link, usePage } from '@inertiajs/react';

type FeatureCard = {
    title: string;
    description: string;
    href: string;
    accent: string;
    icon: JSX.Element;
};

type MustVisitAttraction = {
    id: number;
    name: string;
    description: string;
    slug: string;
    environmental_fee: string | null;
    featured_image_url: string | null;
};

type IncomingEvent = {
    id: number;
    title: string;
    slug: string;
    starts_at: string | null;
    venue_name: string | null;
    featured_image_url: string | null;
};

type WelcomeProps = {
    auth?: { user?: unknown };
    incoming_events?: IncomingEvent[];
    must_visit_attractions?: MustVisitAttraction[];
};

export default function Welcome() {
    const { auth, incoming_events = [], must_visit_attractions = [] } = usePage<WelcomeProps>().props;
    const municipalSealUrl = '/labrador-seal.png';
    const isAuthenticated = Boolean(auth?.user);
    const moduleHref = (href: string) => (isAuthenticated ? href : '/login');

    const featureCards: FeatureCard[] = [
        {
            title: 'Tourist Attractions',
            description: 'Detailed profiles of beaches, landmarks, and must-visit spots.',
            href: '/attractions',
            accent: 'from-teal-500 to-cyan-500',
            icon: <IslandIcon />,
        },
        {
            title: 'Events and Updates',
            description: 'Stay informed about municipal events and tourism announcements.',
            href: '/events',
            accent: 'from-amber-500 to-orange-500',
            icon: <CalendarIcon />,
        },
        {
            title: 'Local Directory',
            description: 'Find accommodations, food spots, and local service providers.',
            href: '/businesses',
            accent: 'from-emerald-500 to-teal-500',
            icon: <StoreIcon />,
        },
        {
            title: 'Interactive Map',
            description: 'Plan routes and explore Labrador with location-based navigation.',
            href: '/map',
            accent: 'from-blue-500 to-indigo-500',
            icon: <MapIcon />,
        },
    ];

    const products = [
        'Fresh seafood and fish catch',
        'Seafood grill specialties',
        'Native kakanin and merienda',
        'Handcrafted local goods',
        'Coastal festival food products',
    ];

    const profileFacts = [
        'Labrador is a coastal municipality in Pangasinan, Region I.',
        'Land area is approximately 90.99 square kilometers.',
        'Population (2020 census): 26,811.',
        'The municipality has 10 barangays facing Lingayen Gulf.',
    ];

    return (
        <>
            <Head title="Welcome to TechTrek Labrador">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="welcome-page min-h-screen bg-slate-50 font-['Instrument_Sans'] text-slate-900 selection:bg-teal-500 selection:text-white dark:bg-gradient-to-b dark:from-emerald-950 dark:via-emerald-950 dark:to-teal-950/95">
                <header className="relative overflow-hidden pb-30 pt-20 md:pb-36 md:pt-28">
                    <div className="absolute inset-0">
                        <img
                            src="/bolo-beach-hero.jpg"
                            alt="Labrador coastal view"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="h-full w-full object-cover object-center [filter:saturate(1.08)_contrast(1.06)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/58 via-emerald-950/68 to-emerald-950/82 dark:hidden" />
                        <div
                            className="absolute inset-0 hidden dark:block"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to top, rgba(2,44,34,0.92) 0%, rgba(4,70,56,0.78) 52%, rgba(8,95,78,0.56) 100%)',
                            }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(20,184,166,0.18),transparent_55%),radial-gradient(circle_at_86%_24%,rgba(16,185,129,0.12),transparent_42%)] dark:hidden" />
                        <div
                            className="absolute inset-0 hidden dark:block"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 52% 26%, rgba(20,184,166,0.14), transparent 54%), radial-gradient(circle at 86% 22%, rgba(16,185,129,0.1), transparent 44%)',
                            }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-emerald-950/92 via-emerald-950/64 to-transparent dark:hidden" />
                        <div
                            className="absolute inset-x-0 bottom-0 hidden h-64 dark:block"
                            style={{
                                backgroundImage: 'linear-gradient(to top, rgba(2,30,25,0.95), rgba(2,30,25,0.62), rgba(2,30,25,0))',
                            }}
                        />
                    </div>

                    <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-600/30">
                                    <PinIcon />
                                </div>
                                <span className="text-2xl font-extrabold tracking-tight text-white">
                                    TechTrek<span className="text-teal-300">Labrador</span>
                                </span>
                            </div>

                            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                                Official Tourism Portal
                            </span>
                            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
                                Discover the Coastal Charm of Labrador
                            </h1>
                            <p className="max-w-2xl text-lg leading-relaxed text-white/90">
                                Explore destinations, events, and community products in Labrador, Pangasinan through one modern tourism platform.
                            </p>
                            <div>
                                <a
                                    href={isAuthenticated ? '/dashboard' : '/login'}
                                    className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-900/70 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-950/35 backdrop-blur-sm transition hover:scale-[1.02] hover:bg-emerald-800/75"
                                >
                                    Get Started Now
                                </a>
                            </div>
                        </div>

                        <div className="self-end rounded-3xl border border-white/35 bg-white/14 p-6 shadow-2xl shadow-emerald-950/25 backdrop-blur-2xl">
                            <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-white/90">
                                Quick Municipality Facts
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <StatCard label="Population (2020)" value="26,811" />
                                <StatCard label="Barangays" value="10" />
                                <StatCard label="Land Area" value="90.99 km2" />
                                <StatCard label="Province" value="Pangasinan" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="relative z-20 -mt-14 px-6 pb-24">
                    <div className="mx-auto max-w-7xl space-y-12">
                        <section id="explore" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featureCards.map((item) => (
                                <Link
                                    key={item.title}
                                    href={moduleHref(item.href)}
                                    prefetch
                                    className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-emerald-700/60 dark:bg-gradient-to-br dark:from-emerald-900/85 dark:to-emerald-950 dark:shadow-[0_14px_34px_rgba(2,12,10,0.5)]"
                                >
                                    <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">{item.description}</p>
                                </Link>
                            ))}
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-emerald-700/55 dark:bg-gradient-to-br dark:from-emerald-900/80 dark:to-emerald-950 dark:shadow-[0_18px_40px_rgba(2,14,11,0.42)]">
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">Incoming Events</p>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Upcoming Municipal Activities</h2>
                                </div>
                                <Link href={moduleHref('/events')} prefetch className="text-sm font-bold text-teal-700 transition hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-200">
                                    View all events
                                </Link>
                            </div>

                            {incoming_events.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-600 dark:border-emerald-700 dark:text-slate-200">
                                    No incoming events posted yet.
                                </div>
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {incoming_events.map((event) => (
                                        <article key={event.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-700/60 dark:bg-emerald-950/65 dark:shadow-[0_10px_26px_rgba(2,14,11,0.34)]">
                                            <div className="h-44 w-full bg-slate-100">
                                                {event.featured_image_url ? (
                                                    <img src={event.featured_image_url} alt={event.title} className="h-full w-full object-cover" loading="lazy" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">No pubmat image</div>
                                                )}
                                            </div>
                                            <div className="space-y-1 p-4">
                                                <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">{event.title}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-200">{event.starts_at ? new Date(event.starts_at).toLocaleString() : 'Date to be announced'}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-200">{event.venue_name ?? 'Venue to be announced'}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section id="about-labrador" className="scroll-mt-28 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 dark:border-emerald-700/55 dark:bg-gradient-to-br dark:from-emerald-900/80 dark:to-emerald-950 dark:shadow-[0_16px_34px_rgba(2,14,11,0.36)]">
                                <div className="mb-5 flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 dark:border-emerald-700 dark:bg-emerald-900/55">
                                    <img
                                        src={municipalSealUrl}
                                        alt="Official Municipal Seal of Labrador, Pangasinan"
                                        className="h-16 w-16 rounded-full border border-teal-200 bg-white p-1 object-contain"
                                    />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.11em] text-teal-700 dark:text-teal-300">Official Seal</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">Municipality of Labrador</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-200">Pangasinan, Philippines</p>
                                    </div>
                                </div>

                                <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">About Labrador</h2>
                                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                                    Labrador is a coastal municipality in Pangasinan with vibrant communities, shoreline attractions, and growing tourism opportunities.
                                </p>
                                <ul className="space-y-3">
                                    {profileFacts.map((fact) => (
                                        <li key={fact} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-100">
                                            <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500" />
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 dark:border-emerald-700/55 dark:bg-gradient-to-br dark:from-emerald-900/80 dark:to-emerald-950 dark:shadow-[0_16px_34px_rgba(2,14,11,0.36)]">
                                <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Local Products</h2>
                                <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                                    Labrador offers coastal-inspired cuisine and local products from small businesses and community vendors.
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {products.map((item) => (
                                        <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-600/70 dark:bg-emerald-900/40 dark:text-emerald-100">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">Top Destinations</p>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Must-Visit Places in Labrador</h2>
                                </div>
                            </div>

                            {must_visit_attractions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-600">
                                    No published attractions yet.
                                </div>
                            ) : (
                                <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                    {must_visit_attractions.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={moduleHref(`/attractions/${item.slug}`)}
                                            prefetch
                                            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-emerald-700/55 dark:bg-gradient-to-b dark:from-emerald-900/80 dark:to-emerald-950 dark:shadow-[0_14px_30px_rgba(2,14,11,0.34)]"
                                        >
                                            <div className="relative h-48 w-full bg-slate-100">
                                                {item.featured_image_url ? (
                                                    <img src={item.featured_image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/40 to-transparent" />
                                            </div>
                                            <div className="space-y-2 p-5">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                                {item.environmental_fee && Number(item.environmental_fee) > 0 && (
                                                    <p className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-600/70 dark:bg-emerald-900/45 dark:text-emerald-100">
                                                        Environmental Fee: PHP {Number(item.environmental_fee).toFixed(2)}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">{item.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        <footer className="border-t border-slate-200 pt-8 text-center dark:border-emerald-700/55">
                            <p className="text-sm text-slate-500 dark:text-slate-300">
                                &copy; {new Date().getFullYear()} TechTrek Labrador. Municipality of Labrador, Pangasinan.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/35 bg-white/14 px-4 py-3 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/75">{label}</p>
            <p className="mt-1 text-xl font-extrabold tracking-tight">{value}</p>
        </div>
    );
}

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const IslandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5A1.5 1.5 0 0021.75 18V6A1.5 1.5 0 0020.25 4.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437A1.125 1.125 0 0021 19.806V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.125 1.125 0 01-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689A1.125 1.125 0 003 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934a1.125 1.125 0 011.006 0l4.994 2.497a1.125 1.125 0 001.006 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75z" />
    </svg>
);

const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75A3 3 0 016.75 6.75h10.5a3 3 0 013 3V21H3.75V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6" />
    </svg>
);
