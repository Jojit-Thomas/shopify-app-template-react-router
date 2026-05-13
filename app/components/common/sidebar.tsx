import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import { LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/app" },
  { name: "Settings", icon: <Settings size={18} />, to: "/app/settings" },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex w-60 bg-black text-white rounded-3xl p-5 flex-col gap-2 shrink-0">
      {navItems.map((item) => (
        <NavLink
          end
          key={item.name}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-2xl overflow-hidden",
              isActive ? "bg-white text-black cutout-tab" : "hover:bg-neutral-800",
            )
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
