import Link from "next/link";
import { Briefcase, CheckSquare, BarChart2, Calendar } from "lucide-react";

const sidebarItems = [
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks?status=in-progress" },
  { icon: BarChart2, label: "Stats", href: "/stats" },
  { icon: Calendar, label: "Events", href: "/events" },
];

const Sidebar = () => {
  return (
    <nav className="bg-gray-100 w-64 p-4">
      <ul className="space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
