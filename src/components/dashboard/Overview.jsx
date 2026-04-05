import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  Wallet, Activity, PiggyBank, Target, Zap, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const DashboardOverview = ({ isMobile, isTablet }) => {
  const { transactions, summary, insights, CATEGORY_META } = useFinance();

  const chartData = useMemo(() => {
    const grouped = {};
    transactions.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!grouped[month]) grouped[month] = { month, income: 0, expense: 0 };
      grouped[month][t.type] += t.amount;
    });
    return Object.values(grouped);
  }, [transactions]);

  const categoryData = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(i => i.name === t.category);
        if (existing) existing.value += t.amount;
        else acc.push({ name: t.category, value: t.amount });
        return acc;
      }, [])
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [transactions]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#f97316'];

  const cards = [
    {
      title: 'Total Balance', value: summary.totalBalance,
      icon: Wallet, color: '#6366f1', bg: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
      trend: 'up', trendVal: '12.5%', desc: 'vs last month',
    },
    {
      title: 'Income', value: summary.totalIncome,
      icon: TrendingUp, color: '#10b981', bg: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.06))',
      trend: 'up', trendVal: '8.2%', desc: 'vs last month',
    },
    {
      title: 'Expenses', value: summary.totalExpenses,
      icon: TrendingDown, color: '#ef4444', bg: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(248,113,113,0.06))',
      trend: 'down', trendVal: '3.1%', desc: 'vs last month',
    },
    {
      title: 'Savings Rate', value: insights.savingsRate,
      icon: PiggyBank, color: '#8b5cf6', bg: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(167,139,250,0.06))',
      trend: insights.savingsRate > 20 ? 'up' : 'down',
      trendVal: `${insights.savingsRate}%`, desc: 'of income saved', isSuffix: true,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>{label}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginTop: '2px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{entry.name}:</span>
            <span style={{ fontWeight: 600 }}>${entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Alex 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Here's what's happening with your finances today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: isMobile ? '12px' : '16px' }}>
        {cards.map((card, i) => (
          <div key={card.title} className={`card card-interactive animate-fade-up stagger-${i + 1}`}
            style={{ background: card.bg, borderColor: `${card.color}20` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                padding: '10px', borderRadius: '12px',
                backgroundColor: `${card.color}18`, color: card.color, display: 'flex',
              }}>
                <card.icon size={22} />
              </div>
              <div className="badge" style={{
                backgroundColor: card.trend === 'up' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: card.trend === 'up' ? 'var(--success)' : 'var(--danger)',
              }}>
                {card.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trendVal}
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '2px' }}>
              {card.title}
            </p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {card.isSuffix
                ? <AnimatedNumber value={card.value} suffix="%" />
                : <AnimatedNumber value={card.value} prefix="$" />
              }
            </h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{card.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '16px', minHeight: isMobile ? 'auto' : '380px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Income vs Expenses</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Monthly comparison</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#6366f1' }} />
                <span style={{ color: 'var(--text-muted)' }}>Income</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#ef4444' }} />
                <span style={{ color: 'var(--text-muted)' }}>Expenses</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2.5} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Spending by Category</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Where your money goes</p>
          <div style={{ flex: 1, minHeight: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={CATEGORY_META[entry.name]?.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {categoryData.slice(0, 4).map((cat, i) => {
              const meta = CATEGORY_META[cat.name] || { color: COLORS[i], emoji: '📌' };
              const pct = Math.round(cat.value / summary.totalExpenses * 100);
              return (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <span>{meta.emoji}</span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontWeight: 700 }}>{pct}%</span>
                  <div style={{ width: '50px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', backgroundColor: meta.color, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: '16px' }}>
        <div className="card card-interactive" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
          borderColor: 'rgba(99,102,241,0.15)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.12)', color: 'var(--primary)', flexShrink: 0 }}>
              <Target size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>Top Spending</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>{insights.topCategory.name}</strong> is your biggest expense
                at <strong style={{ color: 'var(--primary)' }}>${insights.topCategory.amount.toLocaleString()}</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="card card-interactive" style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(52,211,153,0.04))',
          borderColor: 'rgba(16,185,129,0.15)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--success)', flexShrink: 0 }}>
              <Zap size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>Savings Rate</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You're saving <strong style={{ color: 'var(--success)' }}>{insights.savingsRate}%</strong> of your income.
                {insights.savingsRate >= 20 ? ' Great job!' : ' Try to aim for 20%.'}
              </p>
            </div>
          </div>
        </div>

        <div className="card card-interactive" style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(251,191,36,0.04))',
          borderColor: 'rgba(245,158,11,0.15)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--warning)', flexShrink: 0 }}>
              <Activity size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>Monthly Trend</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {insights.monthOverMonthChange !== null ? (
                  <>Spending is <strong style={{ color: insights.monthOverMonthChange > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {insights.monthOverMonthChange > 0 ? 'up' : 'down'} {Math.abs(insights.monthOverMonthChange)}%
                  </strong> from last month.</>
                ) : 'Not enough data for comparison.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Activity</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 5 transactions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {recentTransactions.map((t, i) => {
            const meta = CATEGORY_META[t.category] || { color: '#64748b', emoji: '📌' };
            return (
              <div key={t.id} className="animate-slide-right" style={{
                display: 'flex', alignItems: 'center', padding: '12px 8px', gap: '14px',
                borderRadius: '12px', transition: 'background 0.15s',
                animationDelay: `${i * 0.06}s`,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: `${meta.color}15`, color: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>
                  {meta.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.note || t.category}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)',
                }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
