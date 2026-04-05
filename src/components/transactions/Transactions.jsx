import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit3, ArrowUp, ArrowDown, Download, AlertCircle, FileText } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from './TransactionModal';

const TransactionList = () => {
  const { transactions, role, deleteTransaction, exportCSV, CATEGORY_META } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const categories = useMemo(() =>
    Array.from(new Set(transactions.map(t => t.category))).sort(),
  [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q ||
          t.note?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.amount.toString().includes(q);
        return matchesSearch
          && (typeFilter === 'all' || t.type === typeFilter)
          && (categoryFilter === 'all' || t.category === categoryFilter);
      })
      .sort((a, b) => {
        const mod = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'amount') return (a.amount - b.amount) * mod;
        if (sortBy === 'date') return a.date.localeCompare(b.date) * mod;
        return (a[sortBy] || '').toString().localeCompare((b[sortBy] || '').toString()) * mod;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
    setCurrentPage(1);
  };

  const handleAdd = () => { setEditingTransaction(null); setIsModalOpen(true); };
  const handleEdit = (t) => { if (role !== 'Admin') return; setEditingTransaction(t); setIsModalOpen(true); };

  const incomeTotal = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseTotal = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUp size={12} style={{ opacity: 0.2 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.875rem' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportCSV} className="btn btn-outline">
            <Download size={16} /> Export
          </button>
          {role === 'Admin' && (
            <button onClick={handleAdd} className="btn btn-primary">
              <Plus size={18} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{filtered.length}</div>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
            <ArrowUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Income</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--success)' }}>${incomeTotal.toLocaleString()}</div>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
            <ArrowDown size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Expenses</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--danger)' }}>${expenseTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '2px 12px', borderRadius: '10px', border: '1.5px solid var(--border)',
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, category, or amount..."
              className="input-field"
              style={{ border: 'none', padding: '9px 0', boxShadow: 'none' }}
            />
          </div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="select-field">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="select-field">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {[
                  { key: 'date', label: 'Date', sortable: true },
                  { key: 'category', label: 'Category' },
                  { key: 'note', label: 'Description' },
                  { key: 'amount', label: 'Amount', sortable: true },
                  { key: 'type', label: 'Status' },
                  { key: 'actions', label: '', align: 'right' },
                ].map(col => (
                  <th key={col.key}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                    style={{
                      padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                      cursor: col.sortable ? 'pointer' : 'default',
                      textAlign: col.align || 'left', userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                      {col.label} {col.sortable && <SortIcon field={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((t, i) => {
                const meta = CATEGORY_META[t.category] || { color: '#64748b', emoji: '📌' };
                return (
                  <tr key={t.id} style={{
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                        {meta.emoji} {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.note || '—'}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge" style={{
                        backgroundColor: t.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {role === 'Admin' ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <button onClick={() => handleEdit(t)} className="btn-ghost" style={{ padding: '6px' }}>
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="btn-ghost" style={{ padding: '6px', color: 'var(--danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Read only</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={40} color="var(--text-muted)" style={{ opacity: 0.4 }} />
                      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>No transactions match your filters</p>
                      <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setCategoryFilter('all'); }} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', borderTop: '1px solid var(--border)',
            fontSize: '0.8rem', color: 'var(--text-muted)',
          }}>
            <span>Page {currentPage} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="btn btn-outline"
                disabled={currentPage === 1}
                style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.4 : 1 }}
              >Previous</button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="btn btn-outline"
                disabled={currentPage === totalPages}
                style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.4 : 1 }}
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList;
