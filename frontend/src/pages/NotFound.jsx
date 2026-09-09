import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8">
      <div className="relative">
        <div className="text-[12rem] font-black text-slate-100 dark:text-slate-900 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Lost in the Stack?</h2>
        </div>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md leading-relaxed">
        The page you are looking for doesn't exist or has been moved to a different career path.
      </p>

      <Link
        to="/"
        className="group relative inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
      >
        <span>Return to Dashboard</span>
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}

