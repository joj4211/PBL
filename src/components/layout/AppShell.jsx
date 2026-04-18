export default function AppShell({ children }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      {/* Ambient background orbs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, #B8D0A8, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-float"
        style={{
          background: 'radial-gradient(circle, #DFC99E, transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute top-1/2 right-10 w-64 h-64 rounded-full opacity-15 animate-float"
        style={{
          background: 'radial-gradient(circle, #95B880, transparent 70%)',
          animationDelay: '4s',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
