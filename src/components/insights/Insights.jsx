import React, { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Target, PiggyBank, Zap, BarChart3,
  Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const InsightsPanel = () => {
  const { transactions, summary, insights, CATEGORY_META } = useFinance();

  const monthlyData = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!grouped[month]) grouped[month] = { month, income: 0, expense: 0, net: 0 };
      grouped[month][t.type] += t.amount;
    });
    Object.values(grouped).forEach(m => { m.net = m.income - m.expense; });
    return Object.values(grouped);
  }, [transactions]);

  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    const totals = Array(7).fill(0);
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = new Date(t.date).getDay();
      counts[d]++;
      totals[d] += t.amount;
    });
    return days.map((name, i) => ({ name, amount: totals[i], count: counts[i] }));
  }, [transactions]);

  const biggestTransaction = useMemo(() => {
    if (!transactions.length) return null;
    return transactions.reduce((max, t) => (t.amount > max.amount ? t : max), transactions[0]);
  }, [transactions]);

  const streakInfo = useMemo(() => {
    const expDates = [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.date))].sort();
    let maxGap = 0;
    for (let i = 1; i < expDates.length; i++) {
      const diff = (new Date(expDates[i]) - new Date(expDates[i - 1])) / (1000 * 60 * 60 * 24);
      if (diff > maxGap) maxGap = diff;
    }
    return maxGap;
  }, [transactions]);

  const savingsData = [{
    name: 'Savings',
    value: Math.max(0, insights.savingsRate),
    fill: insights.savingsRate >= 20 ? '#10b981' : '#f59e0b'
  }];

  const StatCard = ({ icon: Icon, iconColor, iconBg, title, value, subtitle, accent }) => (
    <div className="card card-interactive" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{
          padding: '10px', borderRadius: '12px',
          backgroundColor: iconBg, color: iconColor, flexShrink: 0,
        }}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>{title}</p>
          <p style={{ fontSize: '1.35rem', fontWeight: 800, color: accent || 'var(--text-main)' }}>{value}</p>
          {subtitle && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Insights</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Patterns and observations from your financial data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <StatCard
          icon={Target} iconColor="var(--primary)" iconBg="rgba(99,102,241,0.1)"
          title="Top Category" value={insights.topCategory.name}
          subtitle={`$${insights.topCategory.amount.toLocaleString()} total spent`}
        />
        <StatCard
          icon={DollarSign} iconColor="var(--success)" iconBg="rgba(16,185,129,0.1)"
          title="Avg Expense" value={`$${insights.avgExpense.toLocaleString()}`}
          subtitle="Per transaction"
        />
        <StatCard
          icon={Activity} iconColor="var(--warning)" iconBg="rgba(245,158,11,0.1)"
          title="Month-over-Month" accent={insights.monthOverMonthChange > 0 ? 'var(--danger)' : 'var(--success)'}
          value={insights.monthOverMonthChange !== null ? `${insights.monthOverMonthChange > 0 ? '+' : ''}${insights.monthOverMonthChange}%` : 'N/A'}
          subtitle="Expense trend"
        />
        <StatCard
          icon={Calendar} iconColor="var(--info)" iconBg="rgba(6,182,212,0.1)"
          title="Longest No-Spend" value={`${streakInfo} days`}
          subtitle="Gap between expenses"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Monthly Net Savings</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Income minus expenses per month</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
              />
              <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} name="Income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px', alignSelf: 'flex-start' }}>Savings Rate</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', alignSelf: 'flex-start' }}>
            Target: 20% of income
          </p>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart innerRadius="60%" outerRadius="90%" data={savingsData} startAngle={180} endAngle={0}>
                <RadialBar background={{ fill: 'var(--border)' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '-40px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: insights.savingsRate >= 20 ? 'var(--success)' : 'var(--warning)' }}>
              {insights.savingsRate}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {insights.savingsRate >= 20 ? 'On track! 🎉' : 'Below target 🎯'}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Spending by Day of Week</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>When do you spend the most?</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
            />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={32} name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>Category Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {insights.categoryBreakdown.slice(0, 6).map(([name, amount]) => {
              const meta = CATEGORY_META[name] || { color: '#64748b', emoji: '📌' };
              const pct = Math.round(amount / summary.totalExpenses * 100);
              return (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                      <span>{meta.emoji}</span> {name}
                    </span>
                    <span style={{ fontWeight: 700 }}>${amount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: '3px',
                      backgroundColor: meta.color, transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {biggestTransaction && (
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>Notable Records</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
                border: '1px solid rgba(99,102,241,0.1)',
              }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Largest Transaction
                </p>
                <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>${biggestTransaction.amount.toLocaleString()}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {biggestTransaction.note || biggestTransaction.category} · {new Date(biggestTransaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div style={{
                padding: '16px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(52,211,153,0.04))',
                border: '1px solid rgba(16,185,129,0.1)',
              }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Transactions
                </p>
                <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--success)' }}>{insights.totalTransactions}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Across {insights.categoryBreakdown.length} categories
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
