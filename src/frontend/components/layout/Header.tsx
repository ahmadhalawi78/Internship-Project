import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export const Header = () => {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="hidden md:block">
                <DesktopNav />
            </div>
            <div className="block md:hidden">
                <MobileNav />
            </div>
        </header>
    );
};
