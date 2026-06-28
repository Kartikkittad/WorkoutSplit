import BottomNav from '@/components/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <div style={{ padding: '0 20px' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
