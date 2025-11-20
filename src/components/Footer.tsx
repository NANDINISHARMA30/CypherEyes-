export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-6 px-8 mt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <span>© {new Date().getFullYear()} IDS Monitor. All rights reserved.</span>
          <span className="text-gray-600">|</span>
          <span>Version 2.3.1</span>
        </div>
        <div>
          <a
            href="#"
            className="text-sm hover:text-sky-400 transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
