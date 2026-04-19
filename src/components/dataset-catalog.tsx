import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface Dataset {
  id: string;
  name: string;
  country: string;
  size: string;
  frames: string;
  access: "public" | "license" | "license-edu" | "license-staff";
  task: string;
  annotation: string;
  year: number;
  source_url: string | null;
  paper_url?: string;
  notes?: string;
}

interface Props {
  datasets: Dataset[];
}

type SortCol = "name" | "country" | "size" | "year";
type SortDir = "asc" | "desc";

const accessStyles: Record<string, { label: string; cls: string }> = {
  public: { label: "Public", cls: "bg-[rgb(var(--public))]/10 text-[rgb(var(--public))] border border-[rgb(var(--public))]/20" },
  license: { label: "License", cls: "bg-[rgb(var(--license))]/10 text-[rgb(var(--license))] border border-[rgb(var(--license))]/20" },
  "license-edu": { label: ".edu", cls: "bg-[rgb(var(--license))]/10 text-[rgb(var(--license))] border border-[rgb(var(--license))]/20" },
  "license-staff": { label: "Staff", cls: "bg-[rgb(var(--staff))]/10 text-[rgb(var(--staff))] border border-[rgb(var(--staff))]/20" },
};

export default function DatasetCatalog({ datasets }: Props) {
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterAccess, setFilterAccess] = useState("");
  const [filterFrames, setFilterFrames] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("country");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const countries = useMemo(() => [...new Set(datasets.map((d) => d.country))].sort(), [datasets]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return datasets
      .filter((d) => {
        if (q && !d.name.toLowerCase().includes(q) && !d.country.toLowerCase().includes(q) && !(d.notes || "").toLowerCase().includes(q)) return false;
        if (filterCountry && d.country !== filterCountry) return false;
        if (filterAccess && d.access !== filterAccess) return false;
        if (filterFrames && !d.frames.toLowerCase().includes(filterFrames)) return false;
        return true;
      })
      .sort((a, b) => {
        let va: string | number = a[sortCol] ?? "";
        let vb: string | number = b[sortCol] ?? "";
        if (sortCol === "year") { va = Number(va) || 0; vb = Number(vb) || 0; }
        else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [datasets, search, filterCountry, filterAccess, filterFrames, sortCol, sortDir]);

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function SortArrow({ col }: { col: SortCol }) {
    if (sortCol !== col) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1 text-[rgb(var(--accent))]">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  function handleOutboundClick(e: React.MouseEvent<HTMLAnchorElement>, dataset: Dataset) {
    try {
      const clicks = JSON.parse(localStorage.getItem("lpr_clicks") || "[]");
      clicks.push({ dataset: dataset.name, type: "source", url: dataset.source_url, time: Date.now() });
      if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
      localStorage.setItem("lpr_clicks", JSON.stringify(clicks));
    } catch { /* silent */ }
  }

  const selectClass = "px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]/40 transition-all cursor-pointer";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl border border-[rgb(var(--card-border))] bg-[rgb(var(--card))]/50 backdrop-blur-sm">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))] text-sm placeholder:text-[rgb(var(--muted))]/60 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]/40 focus:border-[rgb(var(--accent))]/50 transition-all"
          />
        </div>
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className={selectClass}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className={selectClass}>
          <option value="">All Access</option>
          <option value="public">Public</option>
          <option value="license">License</option>
          <option value="license-edu">License (.edu)</option>
          <option value="license-staff">License (Staff)</option>
        </select>
        <select value={filterFrames} onChange={(e) => setFilterFrames(e.target.value)} className={selectClass}>
          <option value="">All Frames</option>
          <option value="single">Single</option>
          <option value="multi">Multi</option>
        </select>
      </div>

      {/* Stats */}
      <p className="text-sm text-[rgb(var(--muted))] mb-4">
        Showing <span className="font-semibold text-[rgb(var(--fg))]">{filtered.length}</span> of {datasets.length} datasets
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--card-border))] bg-[rgb(var(--card))]/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[rgb(var(--bg-subtle))] border-b border-[rgb(var(--card-border))]">
              {(["name", "country", "size", "year"] as SortCol[]).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))] cursor-pointer hover:text-[rgb(var(--fg))] select-none transition-colors"
                >
                  {col}<SortArrow col={col} />
                </th>
              ))}
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Frames</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Access</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--card-border))]/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-[rgb(var(--muted))]">
                  No datasets match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((d) => {
                const badge = accessStyles[d.access] || accessStyles.license;
                return (
                  <tr key={d.id} className="table-row group">
                    <td className="px-5 py-4 font-medium">
                      <a
                        href={`/datasets/${d.id}`}
                        className="text-[rgb(var(--fg))] hover:text-[rgb(var(--accent))] transition-colors font-semibold"
                        data-astro-prefetch
                      >
                        {d.name}
                      </a>
                      <span className="inline-flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-all">
                        {d.source_url && (
                          <a
                            href={d.source_url}
                            target="_blank"
                            rel="noopener"
                            onClick={(e) => handleOutboundClick(e, d)}
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all"
                            title="Source Repository"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        )}
                        {d.paper_url && (
                          <a
                            href={d.paper_url}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all"
                            title="Paper"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">{d.country}</td>
                    <td className="px-5 py-4 font-mono text-xs tabular-nums">{d.size || "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs tabular-nums">{d.year || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "badge",
                        d.frames.toLowerCase() === "multi"
                          ? "bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/20"
                          : "bg-[rgb(var(--public))]/10 text-[rgb(var(--public))] border border-[rgb(var(--public))]/20"
                      )}>
                        {d.frames}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("badge", badge.cls)}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[rgb(var(--muted))] text-xs max-w-[220px]" title={d.notes}>
                      {d.notes || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
