import { NavLink } from "react-router";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/app" },
  { name: "Settings", icon: Settings, to: "/app/settings" },
];

const MobileTabs = () => {
  return (
    <div className="md:hidden absolute bottom-0 left-0 right-0 bg-black text-white flex justify-around py-3 border-t border-neutral-800 z-30 rounded-b-3xl">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          className={({ isActive }) =>
            cn("flex flex-col items-center text-xs", isActive ? "text-white" : "text-neutral-400")
          }
        >
          <item.icon size={20} />
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileTabs;
