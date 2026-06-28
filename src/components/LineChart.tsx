'use client';

import { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  title?: string;
}

/** Build a smooth cubic-bezier SVG path through the given points. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpx = (curr.x + next.x) / 2;
    path += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
  }
  return path;
}

/**
 * Compute "nice" grid tick values that are clean round numbers.
 * e.g. for range 66–79 → ticks at 65, 70, 75, 80
 */
function niceGridTicks(rawMin: number, rawMax: number, targetCount: number): number[] {
  const range = rawMax - rawMin || 1;

  // Pick a "nice" step: 1, 2, 5, 10, 20, 25, 50, 100…
  const roughStep = range / (targetCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const candidates = [1, 2, 2.5, 5, 10];
  let step = candidates[candidates.length - 1] * mag;
  for (const c of candidates) {
    if (c * mag >= roughStep) {
      step = c * mag;
      break;
    }
  }

  // Round min down and max up to the step
  const tickMin = Math.floor(rawMin / step) * step;
  const tickMax = Math.ceil(rawMax / step) * step;

  const ticks: number[] = [];
  for (let v = tickMin; v <= tickMax + step * 0.01; v += step) {
    ticks.push(Math.round(v * 1000) / 1000); // avoid float drift
  }
  return ticks;
}

/** Format a tick value for display */
function formatTick(val: number): string {
  if (Math.abs(val) >= 10000) return `${(val / 1000).toFixed(0)}k`;
  if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(1).replace(/\.0$/, '');
}

export default function LineChart({
  data,
  color = '#C8F135',
  height = 220,
  title,
}: LineChartProps) {
  const chartWidth = 380;
  const paddingLeft = 48;
  const paddingRight = 20;
  const paddingTop = 28;
  const paddingBottom = 36;

  const uid = useMemo(
    () => Math.random().toString(36).slice(2, 8),
    []
  );

  const chart = useMemo(() => {
    if (data.length === 0) return null;

    const values = data.map((d) => d.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);

    // Get clean round grid ticks
    const ticks = niceGridTicks(rawMin, rawMax, 5);
    const minVal = ticks[0];
    const maxVal = ticks[ticks.length - 1];
    const valueRange = maxVal - minVal || 1;

    const plotWidth = chartWidth - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Map data to SVG coordinates
    const points = data.map((d, i) => {
      const x =
        paddingLeft +
        (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2);
      const y =
        paddingTop +
        plotHeight -
        ((d.value - minVal) / valueRange) * plotHeight;
      return { x, y, label: d.label, value: d.value };
    });

    // Smooth curve path
    const linePath = smoothPath(points);

    // Closed area path for gradient fill
    const bottomY = paddingTop + plotHeight;
    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x},${bottomY}` +
      ` L ${points[0].x},${bottomY} Z`;

    // Grid lines from clean ticks
    const gridLines = ticks.map(val => ({
      y: paddingTop + plotHeight - ((val - minVal) / valueRange) * plotHeight,
      val,
    }));

    // X-axis labels — show at most 5 to avoid crowding
    const maxLabels = 5;
    const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));

    return { points, linePath, areaPath, gridLines, labelStep, plotHeight, bottomY };
  }, [data, height]);

  /* ---------- Empty state ---------- */
  if (!chart || data.length === 0) {
    return (
      <div
        className="line-chart-container line-chart-empty"
        style={{ height }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="line-chart-empty-icon"
        >
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.25"
          />
          <path
            d="M12 32 L20 22 L28 26 L36 14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <circle cx="36" cy="14" r="2.5" fill="currentColor" opacity="0.25" />
        </svg>
        <span className="line-chart-empty-text">No data yet</span>
      </div>
    );
  }

  const { points, linePath, areaPath, gridLines, labelStep } = chart;

  return (
    <div className="line-chart-container">
      {title && (
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </div>
      )}
      <svg
        className="line-chart-svg"
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient fill under the curve */}
          <linearGradient id={`lc-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="60%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Clean grid lines + Y-axis labels */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              className="line-chart-grid-line"
              x1={paddingLeft}
              y1={line.y}
              x2={chartWidth - paddingRight}
              y2={line.y}
            />
            <text
              className="line-chart-y-label"
              x={paddingLeft - 10}
              y={line.y + 4}
              textAnchor="end"
            >
              {formatTick(line.val)}
            </text>
          </g>
        ))}

        {/* Gradient area fill */}
        <path
          className="line-chart-area"
          d={areaPath}
          fill={`url(#lc-grad-${uid})`}
        />

        {/* Smooth curve line */}
        <path
          className="line-chart-line"
          d={linePath}
          stroke={color}
        />

        {/* Data dots — clean, no glow clutter */}
        {points.map((p, i) => (
          <g key={i} className="line-chart-dot-group">
            <circle
              className="line-chart-dot-glow"
              cx={p.x}
              cy={p.y}
              r={8}
              fill={color}
            />
            <circle
              className="line-chart-dot"
              cx={p.x}
              cy={p.y}
              r={4}
              fill={color}
            />
            <circle
              className="line-chart-dot-inner"
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill="#FFFFFF"
            />
          </g>
        ))}

        {/* Value label — only on the LAST point for clarity */}
        {points.length > 0 && (
          <text
            className="line-chart-value-label"
            x={points[points.length - 1].x}
            y={points[points.length - 1].y - 14}
            textAnchor="middle"
          >
            {formatTick(points[points.length - 1].value)}
          </text>
        )}

        {/* X-axis labels */}
        {points.map((p, i) =>
          i % labelStep === 0 || i === points.length - 1 ? (
            <text
              key={`label-${i}`}
              className="line-chart-x-label"
              x={p.x}
              y={height - 8}
              textAnchor="middle"
            >
              {p.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
