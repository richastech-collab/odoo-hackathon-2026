import React from 'react';

const colors = {
  default: 'linear-gradient(145deg, #f9f6f2 0%, #ede8e3 100%)',
  blue: 'linear-gradient(135deg, #e8f0fb 0%, #d8e8f8 100%)',
  yellow: 'linear-gradient(135deg, #fef9ee 0%, #fdf0d5 100%)',
  pink: 'linear-gradient(135deg, #fdeef0 0%, #fce0e3 100%)',
  green: 'linear-gradient(135deg, #e8f7f1 0%, #d8f0e8 100%)',
  purple: 'linear-gradient(135deg, #f2eefb 0%, #e9e4f6 100%)',
};

const FlowNode = ({ icon, title, desc, colorClass = 'default', type = 'default' }) => {
  const bg = colors[colorClass] || colors.default;
  const isDecision = type === 'decision';

  return (
    <div 
      className={`clay-card ${isDecision ? 'animate-float-slow' : ''}`} 
      style={{ 
        background: bg, 
        padding: '14px 16px', 
        width: '180px',
        textAlign: 'center', 
        zIndex: 10,
        borderRadius: isDecision ? '24px' : '20px',
        border: isDecision ? '2px solid rgba(245, 196, 107, 0.4)' : '1.5px solid rgba(255, 255, 255, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon && <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{icon}</div>}
      <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#2d2640', marginBottom: desc ? '4px' : '0', lineHeight: '1.2' }}>
        {title}
      </div>
      {desc && <div style={{ fontSize: '0.65rem', color: '#7b718e', lineHeight: '1.3' }}>{desc}</div>}
    </div>
  );
};

const VLine = ({ height = '30px', arrow = true, dashed = false }) => (
  <div style={{ 
    position: 'relative', 
    width: '2px', 
    height, 
    background: dashed ? 'repeating-linear-gradient(to bottom, rgba(163, 145, 175, 0.5) 0, rgba(163, 145, 175, 0.5) 4px, transparent 4px, transparent 8px)' : 'rgba(163, 145, 175, 0.5)', 
    zIndex: 1 
  }}>
    {arrow && (
      <div style={{ 
        position: 'absolute', 
        bottom: '-2px', 
        left: '-4px', 
        width: '0', 
        height: '0', 
        borderLeft: '5px solid transparent', 
        borderRight: '5px solid transparent', 
        borderTop: '6px solid rgba(163, 145, 175, 0.5)' 
      }} />
    )}
  </div>
);

const HowItWorks = () => (
  <section className="hiw-section" id="how-it-works" style={{ overflow: 'hidden' }}>
    <div className="hiw-header" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="section-label">🔄 Workflow Architecture</div>
      </div>
      <h2 className="section-heading" style={{ textAlign: 'center' }}>
        How TransitOps works
      </h2>
      <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
        A complete map of your operations, perfectly synchronized. See how data flows from user entry through every automated module in the system.
      </p>
    </div>

    {/* Flowchart Container with horizontal scroll for responsiveness */}
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '40px', paddingTop: '10px' }}>
      <div style={{ minWidth: '1300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* --- TOP SECTION: ENTRY --- */}
        <FlowNode title="Landing Page" icon="🏠" colorClass="default" />
        <VLine />
        <FlowNode title="Explore Features Section" icon="✨" colorClass="blue" />
        <VLine />
        <FlowNode title="New or Existing User?" icon="👤" type="decision" colorClass="yellow" />
        
        {/* Split Auth */}
        <div style={{ display: 'flex', width: '400px', position: 'relative', justifyContent: 'space-between', marginTop: '0' }}>
          {/* Top Horizontal Bar for Auth Split */}
          <div style={{ position: 'absolute', top: '0', left: '25%', right: '25%', height: '2px', background: 'rgba(163, 145, 175, 0.5)' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="30px" />
            <FlowNode title="Sign In" icon="🔓" colorClass="default" />
            <div style={{ flex: 1, minHeight: '80px', borderLeft: '2px solid rgba(163, 145, 175, 0.5)' }} className="mt-[-2px]"></div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="30px" />
            <FlowNode title="Sign Up" icon="📝" colorClass="purple" />
            <VLine height="20px" />
            <FlowNode title="Select Role" desc="Fleet Manager, Driver, Safety, Finance" icon="👥" colorClass="blue" />
          </div>
        </div>

        {/* Auth Merge */}
        <div style={{ display: 'flex', width: '400px', position: 'relative', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', top: '0', left: '25%', right: '25%', height: '2px', background: 'rgba(163, 145, 175, 0.5)' }}></div>
           <VLine height="30px" />
        </div>

        <FlowNode title="Main Dashboard" icon="🎛️" colorClass="blue" type="decision" />
        <VLine height="40px" arrow={false} />

        {/* --- BOTTOM SECTION: 6 MODULE BRANCHES --- */}
        <div style={{ display: 'flex', width: '100%', position: 'relative', justifyContent: 'space-between' }}>
          {/* Main Horizontal Distribution Line */}
          <div style={{ position: 'absolute', top: '0', left: '8%', right: '8%', height: '2px', background: 'rgba(163, 145, 175, 0.5)' }}></div>
          
          {/* Branch 1: Vehicle Registry */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Vehicle Registry" icon="🚘" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="Add / Edit Vehicle" desc="Reg No, Type, Capacity, Status" icon="➕" colorClass="green" />
          </div>

          {/* Branch 2: Driver Management */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Driver Management" icon="👤" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="Add / Edit Driver" desc="License, Expiry, Safety Score" icon="➕" colorClass="green" />
          </div>

          {/* Branch 3: Trip Management */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Trip Management" icon="🗺️" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="Create Trip" desc="Source, Dest, Vehicle, Cargo" icon="📍" colorClass="green" />
            <VLine height="20px" />
            <FlowNode title="Validations Pass?" icon="❓" type="decision" colorClass="yellow" />
            
            {/* Validation Yes/No logic visual hint */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#7b718e', fontWeight: 'bold' }}>Yes</div>
                <VLine height="20px" />
                <FlowNode title="Dispatch Trip" icon="🚀" colorClass="purple" />
                <VLine height="20px" />
                <FlowNode title="Auto-Set: On Trip" desc="Vehicle & Driver Status" icon="🔄" colorClass="green" />
                <VLine height="20px" />
                <div style={{ display: 'flex', gap: '10px' }}>
                   <div style={{ background: colors.green, padding: '6px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: 'var(--shadow-clay-sm)' }}>🏁 Complete</div>
                   <div style={{ background: colors.pink, padding: '6px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: 'var(--shadow-clay-sm)' }}>🚫 Cancel</div>
                </div>
                <VLine height="20px" />
                <FlowNode title="Auto-Set: Available" desc="Vehicle & Driver Status" icon="🟢" colorClass="green" />
              </div>
            </div>
          </div>

          {/* Branch 4: Maintenance */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Maintenance" icon="🔧" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="Create Log" desc="Maintenance Request" icon="📋" colorClass="green" />
            <VLine height="20px" />
            <FlowNode title="Auto-Set: In Shop" desc="Vehicle Status" icon="🔴" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="Close Maintenance" icon="✅" colorClass="green" />
            <VLine height="20px" />
            <FlowNode title="Auto-Set: Available" desc="Vehicle Status" icon="🟢" colorClass="green" />
          </div>

          {/* Branch 5: Fuel & Expense */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Fuel & Expense" icon="⛽" colorClass="pink" />
            <VLine height="20px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FlowNode title="Log Fuel" desc="Liters, Cost, Date" icon="💧" colorClass="green" />
              <FlowNode title="Log Expenses" desc="Tolls, Misc" icon="💸" colorClass="green" />
            </div>
            <VLine height="20px" />
            <FlowNode title="Auto-Compute" desc="Operational Cost per Trip" icon="🧮" colorClass="green" />
          </div>

          {/* Branch 6: Reports & Analytics */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <VLine height="20px" />
            <FlowNode title="Reports & Analytics" icon="📈" colorClass="pink" />
            <VLine height="20px" />
            <FlowNode title="View Metrics" desc="Efficiency, Utilization, ROI" icon="📊" colorClass="green" />
            <VLine height="20px" />
            <FlowNode title="Export Reports" desc="CSV and PDF Formats" icon="💾" colorClass="purple" />
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
