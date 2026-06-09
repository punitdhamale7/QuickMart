const WEEKLY = [
  { day: 'Mon', s: 3200 },
  { day: 'Tue', s: 4100 },
  { day: 'Wed', s: 3800 },
  { day: 'Thu', s: 5200 },
  { day: 'Fri', s: 6800 },
  { day: 'Sat', s: 9200 },
  { day: 'Sun', s: 7500 },
];
const MAX = Math.max(...WEEKLY.map((d) => d.s));

/**
 * AnalyticsPreview — 400px height (spec: Section 4 chart)
 */
const AnalyticsPreview = () => (
  <div
    className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white"
    style={{ height: '400px', padding: '24px' }}
  >
    {/* Header row */}
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Sales Chart</h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Weekly revenue overview</p>
      </div>
      <div className="text-right">
        <p style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>₹39,800</p>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E' }}>+15% this week</span>
      </div>
    </div>

    {/* Bar chart — fills remaining height */}
    <div className="flex flex-1 items-end gap-3">
      {WEEKLY.map(({ day, s }) => {
        const pct = (s / MAX) * 100;
        return (
          <div key={day} className="group flex flex-1 flex-col items-center gap-2">
            {/* Value tooltip on hover */}
            <span
              className="invisible group-hover:visible"
              style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}
            >
              ₹{(s / 1000).toFixed(1)}k
            </span>
            {/* Bar container */}
            <div
              className="relative w-full overflow-hidden rounded-md"
              style={{ flex: 1, background: '#F1F5F9' }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 w-full rounded-md transition-all duration-500 group-hover:opacity-80"
                style={{
                  height: `${pct}%`,
                  background: 'linear-gradient(to top, #16A34A, #22C55E)',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>{day}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default AnalyticsPreview;
