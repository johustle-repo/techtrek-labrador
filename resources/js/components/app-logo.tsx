import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm shadow-teal-500/30">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    TechTrek{' '}
                    <span className="font-medium text-teal-600 dark:text-teal-400">
                        Labrador
                    </span>
                </span>
            </div>
        </>
    );
}
