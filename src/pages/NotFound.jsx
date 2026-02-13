import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-slate-400 mt-2">Go back to home.</p>
      <Link
        to="/"
        className="inline-block mt-4 rounded-xl bg-white text-slate-950 px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
      >
        Home
      </Link>
    </div>
  );
}
