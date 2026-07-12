/**
 * DashboardPage — Phase 7 Premium Analytics Dashboard
 * Beautiful charts, KPI cards, activity feed — all powered by Recharts.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';

/* ── Mock data ───────────────────────────────────────────────── */
const MONTHLY_EXPENSES = [
  { month: 'Feb', fuel: 3200, maintenance: 800, tolls: 420 },
  { month: 'Mar', fuel: 2900, maintenance: 1200, tolls: 390 },
  { month: 'Apr', fuel: 4100, maintenance: 650, tolls: 510 },
  { month: 'May', fuel: 3700, maintenance: 900, tolls: 470 },
  { month: 'Jun', fuel: 4500, maintenance: 1100, tolls: 560 },
  { month: 'Jul', fuel: 4200, maintenance: 1250, tolls: 480 },
];

const TRIP_TREND = [
  { day: 'Mon', dispatched: 6, completed: 5 },
  { day: 'Tue', dispatched: 8, completed: 7 },
  { day: 'Wed', dispatched: 5, completed: 5 },
  { day: 'Thu', dispatched: 9, completed: 8 },
  { day: 'Fri', dispatched: 12, completed: 11 },
  { day: 'Sat', dispatched: 4, completed: 4 },
  { day: 'Sun', dispatched: 3, completed: 2 },
];

const VEHICLE_STATUS = [
  { name: 'Available', value: 7, color: '#5ec49a' },
  { name: 'On Trip',   value: 4, color: '#6b9bdf' },
  { name: 'In Shop',   value: 2, color: '#f5c46b' },
  { name: 'Retired',   value: 1, color: '#c7bedd' },
];

const DRIVER_STATUS = [
  { name: 'Available', value: 8, color: '#5ec49a' },
  { name: 'On Trip',   value: 4, color: '#6b9bdf' },
  { name: 'Off Duty',  value: 3, color: '#c7bedd' },
  { name: 'Suspended', value: 1, color: '#f07a7a' },
];

const FUEL_EFFICIENCY = [
  { vehicle: 'VAN-05', km_per_L: 12.4 },
  { vehicle: 'TRK-12', km_per_L: 6.1  },
  { vehicle: 'VAN-08', km_per_L: 10.8 },
  { vehicle: 'TRK-09', km_per_L: 5.9  },
  { vehicle: 'VAN-11', km_per_L: 11.2 },
];

const FLEET_UTILIZATION = [
  { name: 'Utilization', value: 78, fill: '#7b9fe8' },
];

const RECENT_ACTIVITIES = [
  { id: 1, text: 'Trip TRK-102 dispatched to Port C', time: '10 mins ago', icon: '🗺️', color: '#6b9bdf' },
  { id: 2, text: 'VAN-05 flagged for Routine Inspection', time: '1 hour ago', icon: '🔧', color: '#f5c46b' },
  { id: 3, text: 'Fuel logged for Volvo FH16 — $174.00', time: '3 hours ago', icon: '⛽', color: '#f07a7a' },
  { id: 4, text: 'Scania R500 added to fleet registry', time: 'Yesterday', icon: '🚛', color: '#5ec49a' },
  { id: 5, text: 'Trip VAN-093 completed successfully', time: 'Yesterday', icon: '✅', color: '#5ec49a' },
  { id: 6, text: 'Driver Sam Rivera — safety score updated', time: '2 days ago', icon: '👤', color: '#9b7ee6' },
];

/* ── Sub-components ──────────────────────────────────────────── */
const KPICard = ({ icon, label, value, sub, color, trend }) => (
  <div style={{
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1.5px solid rgba(155,126,230,0.15)',
    boxShadow: '6px 6px 18px rgba(163,145,175,0.28), -5px -5px 12px rgba(255,255,255,0.80)',
    padding: '24px 24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '8px 8px 28px rgba(163,145,175,0.35), -6px -6px 16px rgba(255,255,255,0.85)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '6px 6px 18px rgba(163,145,175,0.28), -5px -5px 12px rgba(255,255,255,0.80)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 16,
        background: `${color}18`,
        border: `1.5px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20,
        background: trend >= 0 ? 'rgba(94,196,154,0.12)' : 'rgba(240,122,122,0.12)',
        color: trend >= 0 ? '#3aaa7a' : '#e05555',
        border: `1px solid ${trend >= 0 ? 'rgba(94,196,154,0.25)' : 'rgba(240,122,122,0.25)'}`,
      }}>
        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
      </span>
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#7b718e', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#b5afc7' }}>{sub}</div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, style }) => (
  <div style={{
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1.5px solid rgba(155,126,230,0.15)',
    boxShadow: '6px 6px 18px rgba(163,145,175,0.28), -5px -5px 12px rgba(255,255,255,0.80)',
    padding: 24,
    ...style,
  }}>
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2d2640' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '0.78rem', color: '#b5afc7', marginTop: 4 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const CustomTooltipStyle = {
  background: 'rgba(255,255,255,0.95)',
  border: '1px solid rgba(155,126,230,0.2)',
  borderRadius: 12,
  fontSize: '0.82rem',
  boxShadow: '4px 4px 16px rgba(155,126,230,0.2)',
};

/* ── Main Component ──────────────────────────────────────────── */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7D');

  const totalVehicles = VEHICLE_STATUS.reduce((s, v) => s + v.value, 0);
  const totalDrivers  = DRIVER_STATUS.reduce((s, v) => s + v.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d2640', marginBottom: 4 }}>
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0] || 'User'}! 👋
          </div>
          <div style={{ fontSize: '0.9rem', color: '#7b718e' }}>
            Here's your fleet performance overview for today.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['7D', '30D', '90D'].map(p => (
            <button key={p} onClick={() => setSelectedPeriod(p)} style={{
              padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem',
              border: `1.5px solid ${selectedPeriod === p ? '#7b9fe8' : 'rgba(155,126,230,0.2)'}`,
              background: selectedPeriod === p ? '#7b9fe8' : 'rgba(255,255,255,0.7)',
              color: selectedPeriod === p ? '#fff' : '#7b718e',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>{p}</button>
          ))}
          <button onClick={() => navigate('/app/trips')} style={{
            padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem',
            background: 'linear-gradient(135deg, #7b9fe8, #9b7ee6)',
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '4px 4px 14px rgba(123,159,232,0.4)',
          }}>➕ New Trip</button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <KPICard icon="🚛" label="Total Fleet" value="14" sub="Vehicles registered" color="#7b9fe8" trend={12} />
        <KPICard icon="🗺️" label="Active Trips" value="4" sub="2 in-transit, 2 pending" color="#9b7ee6" trend={8} />
        <KPICard icon="👤" label="Active Drivers" value="12" sub="4 currently on duty" color="#5ec49a" trend={5} />
        <KPICard icon="⛽" label="Monthly Fuel Cost" value="$4.2K" sub="vs $3.7K last month" color="#f07a7a" trend={-13} />
        <KPICard icon="🔧" label="Pending Services" value="2" sub="1 urgent, 1 scheduled" color="#f5c46b" trend={-25} />
        <KPICard icon="📈" label="Fleet Utilization" value="78%" sub="Industry avg. 65%" color="#6b9bdf" trend={18} />
      </div>

      {/* ── Row 2: Area Chart + Radial ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <ChartCard title="Monthly Cost Breakdown" subtitle="Fuel, maintenance & tolls over the past 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_EXPENSES} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b9fe8" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#7b9fe8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b7ee6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#9b7ee6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTolls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5ec49a" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#5ec49a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,126,230,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#b5afc7' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#b5afc7' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={v => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#7b718e' }} />
              <Area type="monotone" dataKey="fuel" name="Fuel" stroke="#7b9fe8" strokeWidth={2.5} fill="url(#colorFuel)" dot={false} />
              <Area type="monotone" dataKey="maintenance" name="Maintenance" stroke="#9b7ee6" strokeWidth={2.5} fill="url(#colorMaint)" dot={false} />
              <Area type="monotone" dataKey="tolls" name="Tolls" stroke="#5ec49a" strokeWidth={2.5} fill="url(#colorTolls)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization" subtitle="Overall fleet active rate">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* CSS-only donut ring — no dependency issues */}
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <div style={{
                width: 160, height: 160,
                borderRadius: '50%',
                background: `conic-gradient(#7b9fe8 0% 78%, #e8e4f5 78% 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 112, height: 112,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(6px)',
                }}>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#7b9fe8', lineHeight: 1 }}>78%</div>
                  <div style={{ fontSize: '0.62rem', color: '#b5afc7', fontWeight: 700, letterSpacing: '0.06em', marginTop: 4 }}>UTILIZATION</div>
                </div>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'In Use', value: 8, color: '#7b9fe8' },
                { label: 'Idle', value: 6, color: '#e8e4f5' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: '#7b718e', flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2d2640' }}>{r.value} vehicles</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Bar Chart + Two Pie Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24 }}>
        <ChartCard title="Weekly Trip Volume" subtitle="Dispatched vs completed trips this week">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TRIP_TREND} barCategoryGap="30%" margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,126,230,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#b5afc7' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#b5afc7' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#7b718e' }} />
              <Bar dataKey="dispatched" name="Dispatched" fill="#7b9fe8" radius={[6,6,0,0]} />
              <Bar dataKey="completed" name="Completed" fill="#5ec49a" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Status" subtitle="Current fleet breakdown">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={VEHICLE_STATUS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {VEHICLE_STATUS.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={CustomTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {VEHICLE_STATUS.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#7b718e', flex: 1 }}>{s.name}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2d2640' }}>{s.value} / {totalVehicles}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Driver Status" subtitle="Workforce at a glance">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DRIVER_STATUS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {DRIVER_STATUS.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={CustomTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {DRIVER_STATUS.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#7b718e', flex: 1 }}>{s.name}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2d2640' }}>{s.value} / {totalDrivers}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 4: Fuel Efficiency bar + Recent Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        <ChartCard title="Fuel Efficiency by Vehicle" subtitle="Kilometers per liter — higher is better">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={FUEL_EFFICIENCY} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,126,230,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#b5afc7' }} axisLine={false} tickLine={false} unit=" km/L" />
              <YAxis type="category" dataKey="vehicle" tick={{ fontSize: 12, fill: '#7b718e', fontWeight: 600 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [`${v} km/L`, 'Efficiency']} />
              <Bar dataKey="km_per_L" radius={[0,8,8,0]}>
                {FUEL_EFFICIENCY.map((entry, index) => (
                  <Cell key={index} fill={entry.km_per_L >= 10 ? '#5ec49a' : entry.km_per_L >= 7 ? '#6b9bdf' : '#f5c46b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activity" subtitle="Latest fleet events">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 260, overflowY: 'auto' }}>
            {RECENT_ACTIVITIES.map((activity, i) => (
              <div key={activity.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 0',
                borderBottom: i !== RECENT_ACTIVITIES.length - 1 ? '1px solid rgba(155,126,230,0.1)' : 'none',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `${activity.color}22`,
                  border: `1.5px solid ${activity.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', flexShrink: 0,
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d2640', lineHeight: 1.4 }}>
                    {activity.text}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#b5afc7', marginTop: 3 }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 5: Quick Actions ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(123,159,232,0.12) 0%, rgba(155,126,230,0.12) 100%)',
        borderRadius: 24,
        border: '1.5px solid rgba(155,126,230,0.2)',
        padding: '24px',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2d2640', marginBottom: 16 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { icon: '🚛', label: 'Manage Fleet', path: '/app/vehicles', color: '#7b9fe8' },
            { icon: '👤', label: 'Driver Roster', path: '/app/drivers', color: '#9b7ee6' },
            { icon: '🗺️', label: 'Dispatch Trip', path: '/app/trips', color: '#5ec49a' },
            { icon: '🔧', label: 'Log Service', path: '/app/maintenance', color: '#f5c46b' },
            { icon: '⛽', label: 'Log Fuel', path: '/app/finance', color: '#f07a7a' },
            { icon: '🧾', label: 'Add Expense', path: '/app/finance', color: '#6b9bdf' },
          ].map(action => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '18px 12px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.75)',
              border: `1.5px solid ${action.color}30`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '4px 4px 12px rgba(163,145,175,0.2)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${action.color}55`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = `${action.color}30`; }}
            >
              <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2d2640' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
