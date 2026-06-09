import { FiTrendingUp } from 'react-icons/fi';

const StatsCard = ({ icon: Icon, title, value, sub }) => (
  <div
    className="flex flex-col justify-between bg-white border border-[#E2E8F0] shadow-sm transition hover:shadow-md"
    style={{ height: '140px', padding: '24px' }}
  >
    <div className="flex items-center justify-between">
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{title}</span>
      <div className="flex h-8 w-8 items-center justify-center bg-[#F8FAFC]">
        <Icon className="h-4 w-4 text-[#64748B]" />
      </div>
    </div>
    <div>
      <p style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
      {sub && (
        <div className="mt-2 flex items-center gap-1.5">
          <FiTrendingUp className="h-3 w-3 text-[#22C55E]" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E' }}>{sub}</span>
        </div>
      )}
    </div>
  </div>
);

export default StatsCard;
