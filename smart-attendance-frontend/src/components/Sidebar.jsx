import { NavLink } from 'react-router-dom';

const linkClasses =
  'block rounded px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900';

export default function Sidebar() {
  return (
    <aside className="hidden w-56 border-r bg-white md:block">
      <nav className="space-y-1 p-4">
        <NavLink to="/" end className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/attendance" className={linkClasses}>
          Attendance
        </NavLink>
        <NavLink to="/students" className={linkClasses}>
          Students
        </NavLink>
        <NavLink to="/reports" className={linkClasses}>
          Reports
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}


