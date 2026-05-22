import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Calendar, DollarSign, CheckSquare,
  Target, Settings, ChevronLeft, ChevronRight, Zap,
  TrendingUp, Bell
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { sidebarCollapsed, activeSection } = state;

  const setSection = (id) => dispatch({ type: 'SET_SECTION', payload: id });
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });

  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: sidebarCollapsed ? '72px' : 'var(--sidebar-width)',
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: sidebarCollapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '72px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(0,212,255,0.3)',
        }}>
          <Zap size={18} color="#fff" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>MyWeb</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v2.0 OS</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed ? '12px' : '11px 14px',
                borderRadius: '10px',
                marginBottom: '2px',
                cursor: 'pointer',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(59,130,246,0.12))'
                  : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-main)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                position: 'relative',
                borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {isActive && !sidebarCollapsed && (
                <div style={{
                  marginLeft: 'auto',
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 8px var(--accent-cyan)',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {!sidebarCollapsed && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '10px',
            marginBottom: '8px',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>SYSTEM STATUS</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>All systems operational</span>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: sidebarCollapsed ? '12px' : '11px 14px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            borderRadius: '10px',
            fontFamily: 'var(--font-main)',
            fontSize: '14px',
            width: '100%',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
