export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} Smart Attendance</span>
        <span>Built with React &amp; Tailwind CSS</span>
      </div>
    </footer>
  );
}


