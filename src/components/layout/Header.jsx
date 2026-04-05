import React from 'react';
import { Search, Bell, Sun, Moon, Menu, UserCircle, Shield, Eye, Download } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const Header = ({ onMenuClick, showMenuButton, isMobile }) => {
  const { role, setRole, isDarkMode, setIsDarkMode, exportCSV } = useFinance();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: isMobile ? '8px' : '16px', flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        {showMenuButton && (
          <button onClick={onMenuClick} className="btn-ghost" style={{ flexShrink: 0 }}>
            <Menu size={22} />
          </button>
        )}

        {!isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '14px',
            border: '1.5px solid var(--border)', backgroundColor: 'var(--bg-card)',
            flex: 1, maxWidth: '420px', transition: 'border-color 0.2s ease',
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text" placeholder="Search anything..."
              style={{
                border: 'none', background: 'none', outline: 'none',
                flex: 1, color: 'var(--text-main)', fontSize: '0.875rem',
              }}
            />
            <kbd style={{
              padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem',
              border: '1px solid var(--border)', color: 'var(--text-muted)',
              fontFamily: 'inherit', fontWeight: 500,
            }}>⌘K</kbd>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px', borderRadius: '12px', border: '1.5px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
        }}>
          <button
            onClick={() => setRole('Admin')}
            style={{
              padding: isMobile ? '5px 10px' : '6px 14px', borderRadius: '8px',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px',
              background: role === 'Admin' ? 'linear-gradient(135deg, var(--primary), #8b5cf6)' : 'transparent',
              color: role === 'Admin' ? 'white' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              boxShadow: role === 'Admin' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            <Shield size={isMobile ? 12 : 14} /> Admin
          </button>
          <button
            onClick={() => setRole('Viewer')}
            style={{
              padding: isMobile ? '5px 10px' : '6px 14px', borderRadius: '8px',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px',
              background: role === 'Viewer' ? 'linear-gradient(135deg, var(--info), #0891b2)' : 'transparent',
              color: role === 'Viewer' ? 'white' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              boxShadow: role === 'Viewer' ? '0 2px 8px rgba(6,182,212,0.3)' : 'none',
            }}
          >
            <Eye size={isMobile ? 12 : 14} /> Viewer
          </button>
        </div>

        {!isMobile && (
          <button onClick={exportCSV} className="btn-ghost" title="Export CSV">
            <Download size={18} />
          </button>
        )}

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="btn-ghost"
          style={{ padding: '8px', borderRadius: '10px', color: isDarkMode ? 'var(--warning)' : 'var(--primary)' }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!isMobile && (
          <>
            <div style={{ position: 'relative' }}>
              <button className="btn-ghost" style={{ padding: '8px' }}><Bell size={18} /></button>
              <div style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: 'var(--danger)', border: '2px solid var(--bg-main)',
              }} />
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border)', margin: '0 4px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>Alex Rivera</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 500, color: role === 'Admin' ? 'var(--primary)' : 'var(--info)' }}>
                  {role}
                </div>
              </div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              }}>
                <UserCircle size={26} />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
