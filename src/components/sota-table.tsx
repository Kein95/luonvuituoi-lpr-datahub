import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface SotaResult {
  method: string;
  paper: string;
  venue: string;
  year: number;
  accuracy: number;
  params_m?: number | null;
  code_url?: string;
  notes?: string;
}

interface SotaEntry {
  id: string;
  dataset_id: string;
  metric: string;
  metric_label: string;
  results: SotaResult[];
}

interface Props {
  sotaData: SotaEntry[];
}

type SortCol = "accuracy" | "year" | "params_m" | "method";

export default function SotaTable({ sotaData }: Props) {
  const [selectedDataset, setSelectedDataset] = useState(sotaData[0]?.dataset_id || "");
  const [sortCol, setSortCol] = useState<SortCol>("accuracy");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const currentEntry = useMemo(
    () => sotaData.find((s) => s.dataset_id === selectedDataset),
    [sotaData, selectedDataset]
  );

  const sorted = useMemo(() => {
    if (!currentEntry) return [];
    return [...currentEntry.results].sort((a, b) => {
      const va = a[sortCol] ?? (sortCol === "accuracy" ? 0 : "");
      const vb = b[sortCol] ?? (sortCol === "accuracy" ? 0 : "");
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [currentEntry, sortCol, sortDir]);

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortCol(col);
      setSortDir(col === "accuracy" ? "desc" : "asc");
    }
  }

  const rankMedals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      {/* Dataset Selector */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="text-sm font-medium text-[rgb(var(--muted))]">Dataset:</label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))] text-sm"
        >
          {sotaData.map((s) => (
            <option key={s.dataset_id} value={s.dataset_id}>
              {s.dataset_id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
        {currentEntry && (
          <span className="text-xs text-[rgb(var(--muted))]">
            Metric: {currentEntry.metric_label} · {currentEntry.results.length} methods
          </span>
        )}
      </div>

      {/* Table */}
      {sorted.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[rgb(var(--card-border))]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[rgb(var(--card))] border-b border-[rgb(var(--card-border))]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))] w-12">#</th>
                <Th col="method" label="Method" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))]">Paper</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))]">Venue</th>
                <Th col="year" label="Year" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <Th col="accuracy" label="Accuracy" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} align="right" />
                <Th col="params_m" label="Params (M)" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} align="right" />
                <th className="px-4 py-3 text-center text-xs font-semibold text-[rgb(var(--muted))]">Code</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr
                  key={r.method + r.year}
                  className={cn(
                    "border-b border-[rgb(var(--card-border))] transition-colors",
                    i < 3 ? "bg-[rgb(var(--accent))]/5" : "hover:bg-[rgb(var(--card))]/50"
                  )}
                >
                  <td className="px-4 py-3 text-center">{rankMedals[i] || i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.method}</td>
                  <td className="px-4 py-3 text-[rgb(var(--muted))] text-xs max-w-[200px] truncate" title={r.paper}>
                    {r.paper}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--muted))]">{r.venue}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.year}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">
                    {r.accuracy.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[rgb(var(--muted))]">
                    {r.params_m ? `${r.params_m}M` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.code_url ? (
                      <a
                        href={r.code_url}
                        target="_blank"
                        rel="noopener"
                        className="text-[rgb(var(--accent))] hover:underline text-xs"
                      >
                        GitHub
                      </a>
                    ) : (
                      <span className="text-[rgb(var(--muted))]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-[rgb(var(--muted))] mt-4">
        Results sourced from published papers. Submit yours via{" "}
        <a href="https://github.com/Kein95/luonvuituoi-lpr-datahub" target="_blank" rel="noopener" className="text-[rgb(var(--accent))] hover:underline">
          GitHub PR
        </a>.
      </p>
    </div>
  );
}

/** Sortable table header cell */
function Th({ col, label, sortCol, sortDir, onSort, align = "left" }: {
  col: SortCol; label: string; sortCol: SortCol; sortDir: string;
  onSort: (col: SortCol) => void; align?: "left" | "right";
}) {
  const isActive = sortCol === col;
  return (
    <th
      onClick={() => onSort(col)}
      className={cn(
        "px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors",
        align === "right" ? "text-right" : "text-left",
        isActive ? "text-[rgb(var(--accent))]" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
      )}
    >
      {label}
      <span className="ml-1">
        {isActive ? (sortDir === "asc" ? "↑" : "↓") : ""}
      </span>
    </th>
  );
}
