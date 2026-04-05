import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  const { addTransaction, updateTransaction, role } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    amount: '',
    type: 'expense',
    note: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction, date: transaction.date || new Date().toISOString().split('T')[0] });
    } else {
      setFormData({ date: new Date().toISOString().split('T')[0], category: 'Food', amount: '', type: 'expense', note: '' });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role !== 'Admin') return;
    const data = { ...formData, amount: parseFloat(formData.amount) };
    if (transaction) updateTransaction(transaction.id, data);
    else addTransaction(data);
    onClose();
  };

  const categories = ['Salary', 'Freelance', 'Food', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Travel', 'Education', 'Investment', 'Other'];

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, backdropFilter: 'blur(6px)', padding: '16px',
      }}
    >
      <div className="card animate-fade-up" style={{
        width: '100%', maxWidth: '480px', padding: '28px',
        backgroundColor: 'var(--bg-card)', position: 'relative',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', right: '16px', top: '16px' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '4px' }}>
          {transaction ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px' }}>
          {transaction ? 'Update the details below.' : 'Fill in the details to log a new record.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['income', 'expense'].map(type => (
                <button key={type} type="button"
                  onClick={() => setFormData(d => ({ ...d, type }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    border: '2px solid',
                    borderColor: formData.type === type
                      ? (type === 'income' ? 'var(--success)' : 'var(--danger)')
                      : 'var(--border)',
                    backgroundColor: formData.type === type
                      ? (type === 'income' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)')
                      : 'transparent',
                    color: formData.type === type
                      ? (type === 'income' ? 'var(--success)' : 'var(--danger)')
                      : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '0.85rem',
                    transition: 'all 0.15s ease',
                    textTransform: 'capitalize',
                  }}
                >{type}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontWeight: 700, color: 'var(--text-muted)', fontSize: '1rem',
              }}>$</span>
              <input
                required type="number" step="0.01" min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(d => ({ ...d, amount: e.target.value }))}
                placeholder="0.00"
                className="input-field"
                style={{ paddingLeft: '32px', fontWeight: 700, fontSize: '1.1rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(d => ({ ...d, category: e.target.value }))}
                className="select-field" style={{ width: '100%' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Date</label>
              <input
                type="date" value={formData.date}
                onChange={(e) => setFormData(d => ({ ...d, date: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData(d => ({ ...d, note: e.target.value }))}
              placeholder="What was this for?"
              className="input-field"
              style={{ minHeight: '72px', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', marginTop: '4px' }}>
            {transaction ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
