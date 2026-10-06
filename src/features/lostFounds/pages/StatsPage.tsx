"use client";

import { useEffect, useState } from "react";
import { IconChartBar, IconLoader2 } from "@tabler/icons-react";
import lostFoundApi from "../api/lostFoundApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";

export type StatRow = {
  label: string;
  total: number;
  lost: number;
  found: number;
};

type RawItem = Record<string, unknown>;

function toNumber(value: unknown): number {
  return Number(value) || 0;
}

// Menormalkan bentuk data statistik (array ataupun objek) menjadi baris tabel.
export function normalizeStats(data: unknown): StatRow[] {
  if (!data || typeof data !== "object") return [];

  const entries: [string, unknown][] = Array.isArray(data)
    ? data.map((item: RawItem, index: number) => [
        String(item?.date ?? item?.label ?? index + 1),
        item,
      ])
    : Object.entries(data);

  return entries.map(([label, value]) => {
    const item = (value && typeof value === "object" ? value : { total: value }) as RawItem;
    return {
      label,
      total: toNumber(item.total ?? item.count),
      lost: toNumber(item.lost),
      found: toNumber(item.found),
    };
  });
}

function StatsTable({
  title,
  rows,
  testId,
}: {
  title: string;
  rows: StatRow[];
  testId: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.total));

  return (
    <div
      data-testid={testId}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">Belum ada data statistik.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li key={row.label} className="px-5 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-slate-700">{row.label}</span>
                <span className="text-slate-500">
                  Total {row.total} · Hilang {row.lost} · Ditemukan {row.found}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${(row.total / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<StatRow[]>([]);
  const [monthly, setMonthly] = useState<StatRow[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [dailyData, monthlyData] = await Promise.all([
          lostFoundApi.getStatsDaily(),
          lostFoundApi.getStatsMonthly(),
        ]);
        if (isMounted) {
          setDaily(normalizeStats(dailyData));
          setMonthly(normalizeStats(monthlyData));
        }
      } catch (error) {
        showErrorDialog((error as Error).message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <IconChartBar size={26} stroke={2} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Statistik Laporan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan laporan kehilangan dan penemuan barang.
          </p>
        </div>
      </div>

      {loading ? (
        <div
          data-testid="stats-loading"
          className="flex items-center gap-2 text-slate-500 text-sm"
        >
          <IconLoader2 size={18} className="animate-spin" /> Memuat statistik...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsTable title="Statistik Harian" rows={daily} testId="stats-daily" />
          <StatsTable title="Statistik Bulanan" rows={monthly} testId="stats-monthly" />
        </div>
      )}
    </div>
  );
}

export default StatsPage;
