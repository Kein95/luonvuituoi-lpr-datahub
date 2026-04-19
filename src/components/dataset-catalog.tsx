import { useState, useMemo } from "react";
import { cn, getFlag } from "@/lib/utils";

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
  notes?: string;
}

interface Props {
  datasets: Dataset[];
}

type SortCol = "name" | "country" | "size" | "year";
type SortDir = "asc" | "desc";

const accessStyles: Record<string, { label: string; class: string }> = {
  public: { label: "Public", class: "bg-[rgb(var(--public))]/15 text-[rgb(var(--public))]" },
  license: { label: "License", class: "bg-[rgb(var(--license))]/15 text-[rgb(var(--license))]" },
  "license-edu": { label: ".edu", class: "bg-[rgb(var(--license))]/15 text-[rgb(var(--license))]" },
  "license-staff": { label: "Staff", class: "bg-[rgb(var(--staff))]/15 text-[rgb(var(--staff))]" },
};

export default function DatasetCatalog({ datasets }: Props) {
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterAccess, setFilterAccess] = useState("");
  const [filterFrames, setFilterFrames] = useState("");
  const [filterTask, setFilterTask] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("country");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const countries = useMemo(() => [...new Set(datasets.map((d) => d.country))].sort(), [datasets]);
  const tasks = useMemo(() => [...new Set(datasets.map((d) => d.task))].sort(), [datasets]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return datasets
      .filter((d) => {
        if (q && !d.name.toLowerCase().includes(q) && !(d.notes || "").toLowerCase().includes(q)) return false;
        if (filterCountry && d.country !== filterCountry) return false;
        if (filterAccess && d.access !== filterAccess) return false;
        if (filterFrames && !d.frames.includes(filterFrames)) return false;
        if (filterTask && d.task !== filterTask) return false;
        return true;
      })
      .sort((a, b) => {
        let va: string | number = a[sortCol] ?? "";
        let vb: string | number = b[sortCol] ?? "";
        if (sortCol === "year") {
          va = Number(va) || 0;
          vb = Number(vb) || 0;
        } else {
          va = String(va).toLowerCase();
          vb = String(vb).toLowerCase();
        }
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [datasets, search, filterCountry, filterAccess, filterFrames, filterTask, sortCol, sortDir]);

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  function SortArrow({ col }: { col: SortCol }) {
    if (sortCol !== col) return <span className="ml-1 text-[rgb(var(--muted))]/40">↕</span>;
    return <span className="ml-1 text-[rgb(var(--accent))]">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  /** Track outbound click and navigate */
  function handleOutboundClick(e: React.MouseEvent<HTMLAnchorElement>, dataset: Dataset) {
    try {
      const clicks = JSON.parse(localStorage.getItem("lpr_clicks") || "[]");
      clicks.push({ dataset: dataset.name, type: "source", url: dataset.source_url, time: Date.now() });
      if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
      localStorage.setItem("lpr_clicks", JSON.stringify(clicks));
    } catch { /* silent */ }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 transition"
        />
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm">
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{getFlag(c)} {c}</option>)}
        </select>
        <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className="px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm">
          <option value="">All Access</option>
          <option value="public">Public</option>
          <option value="license">License</option>
          <option value="license-edu">License (.edu)</option>
          <option value="license-staff">License (staff)</option>
        </select>
        <select value={filterFrames} onChange={(e) => setFilterFrames(e.target.value)} className="px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm">
          <option value="">All Frames</option>
          <option value="single">Single</option>
          <option value="multi">Multi</option>
        </select>
        <select value={filterTask} onChange={(e) => setFilterTask(e.target.value)} className="px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm">
          <option value="">All Tasks</option>
          {tasks.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Stats */}
      <p className="text-sm text-[rgb(var(--muted))] mb-4">
        Showing {filtered.length} of {datasets.length} datasets
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--card-border))]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[rgb(var(--card))] border-b border-[rgb(var(--card-border))]">
              {(["name", "country", "size", "year"] as SortCol[]).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))] cursor-pointer hover:text-[rgb(var(--fg))] select-none transition-colors"
                >
                  {col}<SortArrow col={col} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">Frames</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">Access</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">Task</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[rgb(var(--muted))]">
                  No datasets match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((d) => {
                const badge = accessStyles[d.access] || accessStyles.license;
                return (
                  <tr key={d.id} className="border-b border-[rgb(var(--card-border))] hover:bg-[rgb(var(--card))]/50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <a
                        href={`/datasets/${d.id}`}
                        className="text-[rgb(var(--accent))] hover:underline"
                        data-astro-prefetch
                      >
                        {getFlag(d.country)} {d.name}
                      </a>
                      {d.source_url && (
                        <a
                          href={d.source_url}
                          target="_blank"
                          rel="noopener"
                          onClick={(e) => handleOutboundClick(e, d)}
                          className="ml-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-colors"
                          title="External source"
                        >
                          ↗
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[rgb(var(--muted))]">{d.country}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.size || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.year || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-semibold", d.frames.includes("multi") && "text-[rgb(var(--accent))]")}>
                        {d.frames}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", badge.class)}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[rgb(var(--muted))] text-xs">{d.task}</td>
                    <td className="px-4 py-3 text-[rgb(var(--muted))] text-xs max-w-[250px] truncate" title={d.notes}>
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
