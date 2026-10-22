import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Check,
} from 'lucide-react';
import { getLocalTodayStr } from '../utils/storage';

export const InsightsView: React.FC = () => {
  const { data } = useApp();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Default to today

  const todayStr = getLocalTodayStr();
  const today = new Date();

  // Compute 7 calendar days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayLabel = i === 6 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Sessions on this day
    const daySessions = data.sessions.filter(
      (s) => s.endedAt && s.endedAt.slice(0, 10) === dateStr
    );
    const totalMinutes = Math.round(
      daySessions.reduce((acc, s) => acc + s.actualSeconds, 0) / 60
    );

    // Tasks completed on this day
    const completedTasksOnDay = data.tasks.filter(
      (t) => t.status === 'completed' && t.completedAt && t.completedAt.slice(0, 10) === dateStr
    );

    return {
      date: dateStr,
      label: dayLabel,
      fullDate,
      isToday: dateStr === todayStr,
      minutes: totalMinutes,
      tasksDone: completedTasksOnDay.length,
      tasksList: completedTasksOnDay,
    };
  });

  // Accomplishment & consistency statistics
  const totalTasksCompletedAllTime = data.tasks.filter((t) => t.status === 'completed').length;
  const totalCompleted7Days = last7Days.reduce((acc, d) => acc + d.tasksDone, 0);
  const activeDaysCount = last7Days.filter((d) => d.tasksDone > 0 || d.minutes > 0).length;
  const dailyAverageTasks = (totalCompleted7Days / 7).toFixed(1);

  // Peak day for completed tasks
  const maxTasksCompleted = Math.max(4, ...last7Days.map((d) => d.tasksDone));
  const peakTasksDay = [...last7Days].sort((a, b) => b.tasksDone - a.tasksDone)[0];

  // Focus time metrics
  const maxMinutes = Math.max(60, ...last7Days.map((d) => d.minutes));
  const totalWeeklyMinutes = last7Days.reduce((acc, d) => acc + d.minutes, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const totalSessions = data.sessions.length;

  const totalTasksCount = data.tasks.length;
  const completionRatio =
    totalTasksCount > 0 ? Math.round((totalTasksCompletedAllTime / totalTasksCount) * 100) : 0;

  const avgSessionMins =
    totalSessions > 0
      ? Math.round(
          data.sessions.reduce((acc, s) => acc + s.actualSeconds, 0) / (totalSessions * 60)
        )
      : 0;

  // SVG Chart Geometry
  const chartWidth = 640;
  const chartHeight = 190;
  const paddingX = 48;
  const paddingBottom = 40;
  const paddingTop = 28;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const baselineY = chartHeight - paddingBottom;

  // Generate chart data coordinates
  const chartPoints = last7Days.map((day, index) => {
    const x = paddingX + index * (innerWidth / 6);
    const normalizedY = (day.tasksDone / maxTasksCompleted) * innerHeight;
    const y = baselineY - normalizedY;
    return { x, y, day, index };
  });

  // Calculate smooth cubic bezier path
  const getSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const linePath = getSmoothPath(chartPoints);
  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},${baselineY} L ${chartPoints[0].x.toFixed(1)},${baselineY} Z`;

  // Grid levels for Y-axis (integer steps)
  const yTicks = [
    { value: 0, y: baselineY },
    { value: Math.round(maxTasksCompleted / 2), y: baselineY - innerHeight / 2 },
    { value: maxTasksCompleted, y: paddingTop },
  ];

  const selectedDay = last7Days[selectedDayIndex] || last7Days[6];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
          Insights & Momentum
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Track completed tasks, consistency rhythms, and focus depth derived from your local session data.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            <span>7-Day Completed</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
            {totalCompleted7Days}
            <span className="text-xs font-normal text-[var(--muted)] ml-1">tasks</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {dailyAverageTasks} avg / day
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium">
            <Award className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
            <span>Consistency</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
            {activeDaysCount}
            <span className="text-xs font-normal text-[var(--muted)] ml-1">/ 7 days</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {activeDaysCount >= 5 ? 'Steady momentum' : 'Gentle sustainable rhythm'}
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium">
            <Clock className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
            <span>Focus Time</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
            {totalWeeklyHours}h{' '}
            <span className="text-xs font-normal text-[var(--muted)]">
              ({totalWeeklyMinutes}m)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {totalSessions} focus blocks
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium">
            <TrendingUp className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
            <span>All-Time Ratio</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
            {completionRatio}%
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            {totalTasksCompletedAllTime} of {totalTasksCount} total tasks
          </p>
        </div>
      </div>

      {/* Visual Summary: 7-Day Completed Tasks Line Chart */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--forest)] dark:bg-[var(--lime)]" />
              <h3 className="text-base font-bold text-[var(--ink)]">
                Completed Tasks Trend (Last 7 Days)
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Track your daily completions to build momentum and see consistent accomplishment.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-soft)] text-[var(--ink-soft)] font-medium">
              <Flame className="w-3.5 h-3.5 text-[#D97706] dark:text-[var(--lime)]" />
              <span>Peak: {peakTasksDay.tasksDone} on {peakTasksDay.label}</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-[var(--muted)]">
              Total: <strong className="text-[var(--ink)]">{totalCompleted7Days}</strong>
            </span>
          </div>
        </div>

        {/* Responsive Interactive SVG Line Chart */}
        <div className="relative pt-2">
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="7-Day Completed Tasks Line Chart"
            >
              <defs>
                <linearGradient id="completedTaskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--forest)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--forest)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {yTicks.map((tick) => (
                <g key={tick.value}>
                  <line
                    x1={paddingX}
                    y1={tick.y}
                    x2={chartWidth - paddingX}
                    y2={tick.y}
                    stroke="var(--line)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 12}
                    y={tick.y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-[var(--muted)]"
                  >
                    {tick.value}
                  </text>
                </g>
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#completedTaskGradient)" />

              {/* Line path */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--forest)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 dark:stroke-[var(--lime)]"
              />

              {/* Data points and hover nodes */}
              {chartPoints.map((pt) => {
                const isSelected = selectedDayIndex === pt.index;
                const isToday = pt.day.isToday;

                return (
                  <g
                    key={pt.day.date}
                    onClick={() => setSelectedDayIndex(pt.index)}
                    className="cursor-pointer group"
                  >
                    {/* Hover target circle for easy tap/click */}
                    <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />

                    {/* Outer accent ring on selected / today */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="11"
                        fill="none"
                        stroke="var(--forest)"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin-slow dark:stroke-[var(--lime)]"
                      />
                    )}

                    {/* Solid node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '6.5' : isToday ? '5.5' : '4.5'}
                      fill="var(--surface)"
                      stroke={
                        isSelected || isToday
                          ? 'var(--forest)'
                          : 'var(--ink-soft)'
                      }
                      strokeWidth="2.5"
                      className="transition-all group-hover:scale-125 dark:stroke-[var(--lime)]"
                    />

                    {/* Value label directly above point */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className={`text-[11px] font-mono font-semibold transition-opacity ${
                        isSelected
                          ? 'fill-[var(--ink)] font-bold'
                          : 'fill-[var(--muted)] group-hover:fill-[var(--ink)]'
                      }`}
                    >
                      {pt.day.tasksDone}
                    </text>

                    {/* X-axis Day Label */}
                    <text
                      x={pt.x}
                      y={baselineY + 18}
                      textAnchor="middle"
                      className={`text-xs font-medium transition-colors ${
                        isSelected || isToday
                          ? 'fill-[var(--forest)] dark:fill-[var(--lime)] font-bold'
                          : 'fill-[var(--muted)]'
                      }`}
                    >
                      {pt.day.label}
                    </text>

                    <text
                      x={pt.x}
                      y={baselineY + 30}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-[var(--muted)] opacity-80"
                    >
                      {pt.day.fullDate}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Day Accomplishment Detail Card */}
          <div className="mt-4 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--ink)]">
                  {selectedDay.label} ({selectedDay.fullDate})
                </span>
                <span className="text-xs text-[var(--muted)]">·</span>
                <span className="text-xs font-mono font-bold text-[var(--forest)] dark:text-[var(--lime)]">
                  {selectedDay.tasksDone} {selectedDay.tasksDone === 1 ? 'task' : 'tasks'} completed
                </span>
                {selectedDay.isToday && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--forest)] text-white dark:bg-[var(--lime)] dark:text-[var(--lime-ink)]">
                    Current Day
                  </span>
                )}
              </div>

              {selectedDay.tasksList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedDay.tasksList.map((task) => (
                    <span
                      key={task.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--surface)] text-[var(--ink)] text-[11px] border border-[var(--line)]"
                    >
                      <Check className="w-3 h-3 text-[var(--success)]" />
                      <span className="truncate max-w-[200px]">{task.title}</span>
                      <span className="text-[10px] font-mono text-[var(--muted)]">
                        {task.estimateMinutes}m
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)] italic pt-0.5">
                  No completed tasks recorded on this date.
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-[var(--muted)] block">Focus Time</span>
              <span className="text-xs font-mono font-semibold text-[var(--ink)]">
                {selectedDay.minutes}m logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Focus Minutes Distribution (Bar Chart) */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)]">
              Focus Minutes by Day
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Daily deep work duration across the last 7 calendar days
            </p>
          </div>
          <div className="text-xs text-[var(--muted)] font-mono">
            Peak Focus: <span className="font-semibold text-[var(--ink)]">{maxMinutes}m</span>
          </div>
        </div>

        {/* Clean Accessible Bar Chart */}
        <div className="pt-2 pb-2" role="region" aria-label="7-Day Focus Distribution Chart">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40">
            {last7Days.map((day) => {
              const heightPercent = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
              return (
                <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-[10px] font-mono tabular-nums text-[var(--ink-soft)]">
                    {day.minutes}m
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[42px] bg-[var(--surface-soft)] rounded-t-lg overflow-hidden flex flex-col justify-end h-28 border border-[var(--line)]">
                    <div
                      className={`w-full transition-all duration-300 rounded-t-md ${
                        day.isToday
                          ? 'bg-[var(--forest)] dark:bg-[var(--lime)]'
                          : 'bg-[var(--surface-strong)] hover:bg-[var(--forest)]/70'
                      }`}
                      style={{ height: `${Math.max(day.minutes > 0 ? 8 : 2, heightPercent)}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={`block text-xs font-medium ${
                        day.isToday
                          ? 'text-[var(--forest)] dark:text-[var(--lime)] font-bold'
                          : 'text-[var(--muted)]'
                      }`}
                    >
                      {day.label}
                    </span>
                    <span className="block text-[10px] font-mono text-[var(--muted)] tabular-nums">
                      {day.tasksDone} done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focus Session Log Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Focus Session Log ({data.sessions.length})
          </h3>
          <span className="text-xs text-[var(--muted)]">
            Stored locally on this device
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] font-medium">
                <th className="py-2.5 pr-4 font-normal">Task / Block</th>
                <th className="py-2.5 px-4 font-normal text-right">Actual Focus</th>
                <th className="py-2.5 px-4 font-normal text-right">Planned</th>
                <th className="py-2.5 pl-4 font-normal text-right">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {data.sessions.slice(0, 8).map((session) => (
                <tr key={session.id} className="hover:bg-[var(--surface-soft)]/50 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-[var(--ink)]">
                    {session.taskTitleSnapshot}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--ink)]">
                    {Math.round(session.actualSeconds / 60)}m
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--muted)]">
                    {session.plannedMinutes}m
                  </td>
                  <td className="py-2.5 pl-4 text-right text-[var(--muted)] font-mono">
                    {session.endedAt
                      ? new Date(session.endedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
              {data.sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--muted)] italic">
                    No focus sessions recorded yet. Start your first session from the Overview or Focus tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
