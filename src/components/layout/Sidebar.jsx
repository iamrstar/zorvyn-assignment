import React from 'react';
import {
  Wallet, ChevronLeft, ChevronRight, LogOut,
  LayoutDashboard, Receipt, Lightbulb, Settings, TrendingUp
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, mobileOpen }) => {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  const visible = isOpen || mobileOpen;
  const width = visible ? '260px' : '72px';

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width, zIndex: 50,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', flexDirection: 'column',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      ...(mobileOpen ? { width: '280px', zIndex: 999 } : {}),
      ...(!isOpen && !mobileOpen && window.innerWidth <= 1024 ? { display: 'none' } : {}),
    }}>
      <div style={{ padding: visible ? '24px 20px' : '24px 0', transition: 'padding 0.3s ease' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          justifyContent: visible ? 'flex-start' : 'center',
          padding: visible ? '0 4px' : '0',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)',
            padding: '10px', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            flexShrink: 0,
          }}>
            <Wallet color="white" size={22} />
          </div>
          {visible && (
            <div style={{ overflow: 'hidden' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                Antifin
              </h2>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Finance Hub
              </span>
            </div>
          )}
        </div>
      </div>

      {!mobileOpen && window.innerWidth > 1024 && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'absolute', right: '-14px', top: '36px',
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)', zIndex: 51,
            border: '3px solid var(--bg-main)',
          }}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      <nav style={{ flex: 1, padding: visible ? '0 12px' : '0 8px', marginTop: '8px' }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: visible ? '8px 12px' : '0', marginBottom: '4px',
          textAlign: visible ? 'left' : 'center',
        }}>
          {visible ? 'Menu' : '•'}
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {links.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className={visible ? '' : 'tooltip-wrapper'}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '12px', padding: visible ? '11px 14px' : '11px 0',
                    borderRadius: '12px',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
                    transition: 'all 0.2s ease',
                    justifyContent: visible ? 'flex-start' : 'center',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    position: 'relative',
                  }}
                >
                  <item.icon size={20} />
                  {visible && <span>{item.label}</span>}
                  {isActive && visible && (
                    <div style={{
                      position: 'absolute', right: '12px', width: '6px', height: '6px',
                      borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)',
                    }} />
                  )}
                </button>
                {!visible && <span className="tooltip-text">{item.label}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{
        padding: visible ? '16px 12px' : '16px 8px',
        borderTop: '1px solid var(--border)',
      }}>
        {visible && (
          <div style={{
            padding: '14px', borderRadius: '14px', marginBottom: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.12)',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
              Pro Tip
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Switch to <strong>Viewer</strong> role to see how restricted access looks.
            </p>
          </div>
        )}
        <button
          className={visible ? '' : 'tooltip-wrapper'}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '12px', padding: '11px 14px', borderRadius: '12px',
            color: 'var(--danger)', transition: 'all 0.15s ease',
            justifyContent: visible ? 'flex-start' : 'center',
            fontSize: '0.875rem', opacity: 0.8,
          }}
        >
          <LogOut size={20} />
          {visible && <span style={{ fontWeight: 500 }}>Sign Out</span>}
          {!visible && <span className="tooltip-text">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
