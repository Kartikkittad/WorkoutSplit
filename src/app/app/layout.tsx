import BottomNav from '@/components/BottomNav';
import OnboardingGuard from '@/components/OnboardingGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard>
      <div className="app-container">
        {children}
        <BottomNav />
      </div>
    </OnboardingGuard>
  );
}
