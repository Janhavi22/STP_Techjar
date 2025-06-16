// import { useState, useEffect } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   Home,
//   Droplet,
//   BarChart,
//   History,
//   Bell,
//   Users,
//   Map,
//   LogOut,
//   AlertTriangle,
//   Settings,
//   Clock1,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { Logo } from "../ui/Logo";

// export const DashboardLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Close sidebar on mobile when route changes
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [location.pathname]);

//   // Define navigation items based on user role
//   const navigationItems =
//     user?.role === "admin"
//       ? [
//           { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
//           { name: "Sites", path: "/admin/sites", icon: <Map size={20} /> },
//           {
//             name: "Operators",
//             path: "/admin/operators",
//             icon: <Users size={20} />,
//           },
//           {
//             name: "Alerts",
//             path: "/admin/alerts",
//             icon: <AlertTriangle size={20} />,
//           },
//           {
//             name: "History",
//             path: "/admin/historydata",
//             icon: <Clock1 size={20} />,
//           },
//         ]
//       : [
//           { name: "Dashboard", path: "/operator", icon: <Home size={20} /> },
//           {
//             name: "Flowmeter Upload",
//             path: "/operator/flowmeter",
//             icon: <BarChart size={20} />,
//           },
//           {
//             name: "Water Quality",
//             path: "/operator/water-quality",
//             icon: <Droplet size={20} />,
//           },
//           {
//             name: "History",
//             path: "/operator/history",
//             icon: <History size={20} />,
//           },
//         ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="flex h-screen bg-slate-50">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-16 items-center justify-center border-b px-6">
//           <Logo />
//         </div>

//         <div className="py-4">
//           {/* User info */}
//           <div className="mb-6 px-6">
//             <p className="text-sm font-medium text-slate-400">Logged in as</p>
//             <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
//             <div className="mt-1 flex items-center">
//               <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 capitalize">
//                 {user?.role}
//               </span>
//               {user?.siteName && (
//                 <span className="ml-2 text-xs text-slate-500">
//                   {user.siteName}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Nav items */}
//           <nav className="space-y-1 px-3">
//             {navigationItems.map((item) => (
//               <button
//                 key={item.path}
//                 onClick={() => navigate(item.path)}
//                 className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                   isActive(item.path)
//                     ? "bg-primary-50 text-primary-700"
//                     : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
//                 }`}
//               >
//                 <span
//                   className={`mr-3 ${
//                     isActive(item.path) ? "text-primary-500" : "text-slate-400"
//                   }`}
//                 >
//                   {item.icon}
//                 </span>
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Logout button */}
//         <div className="absolute bottom-0 w-full border-t p-4">
//           <button
//             onClick={logout}
//             className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
//           >
//             <LogOut size={20} className="mr-3 text-slate-400" />
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top navigation */}
//         <header className="relative z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
//           <button
//             className="rounded-md p-2 text-slate-600 lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu size={24} />
//           </button>

//           <div className="flex items-center space-x-4 lg:ml-auto">
//             {/* Alerts icon - with badge */}
//             <button className="relative rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
//               <Bell size={20} />
//               <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-white">
//                 3
//               </span>
//             </button>

//             {/* Settings */}
//             <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
//               <Settings size={20} />
//             </button>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, Droplet, BarChart, History, Bell, 
  Users, Map, LogOut, AlertTriangle, 
  Clock1, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../ui/Logo';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("Phonyx");  // Default site
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle site change
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSite(e.target.value);
  };

  // Define navigation items based on user role
  const navigationItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
        { name: 'Sites', path: '/admin/sites', icon: <Map size={20} /> },
        { name: 'Operators', path: '/admin/operators', icon: <Users size={20} /> },
        { name: 'Alerts', path: '/admin/alerts', icon: <AlertTriangle size={20} /> },
        { name: 'History', path: '/admin/historydata', icon: <Clock1 size={20} /> },
      ]
    : [
        { name: 'Dashboard', path: '/operator', icon: <Home size={20} /> },
        { name: 'Flowmeter Upload', path: '/operator/flowmeter', icon: <BarChart size={20} /> },
        { name: 'Water Quality', path: '/operator/water-quality', icon: <Droplet size={20} /> },
        { name: 'History', path: '/operator/history', icon: <History size={20} /> },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b px-6">
          <Logo />
        </div>

        <div className="py-4">
          {/* User info */}
          <div className="mb-6 px-6">
            <p className="text-sm font-medium text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
            <div className="mt-1 flex items-center">
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 capitalize">
                {user?.role}
              </span>
              {user?.siteName && (
                <span className="ml-2 text-xs text-slate-500">
                  {user.siteName}
                </span>
              )}
            </div>
          </div>

          {/* Nav items */}
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-primary-500' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </nav>
          
      
        </div>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut size={20} className="mr-3 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="relative z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
          <button
            className="rounded-md p-2 text-slate-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4 lg:ml-auto">
            {/* Alerts icon - with badge */}
            <button className="relative rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-white">
                3
              </span>
            </button>
            
            {/* Settings */}
            <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet context={{ selectedSite }} />
        </main>
      </div>
    </div>
  );
};