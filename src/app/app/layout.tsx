import BottomNav from '@/components/BottomNav';
import OnboardingGuard from '@/components/OnboardingGuard';
import BetaBanner from '@/components/BetaBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard>
      <div className="app-container">
        <BetaBanner />
        {children}
        <BottomNav />
      </div>
    </OnboardingGuard>
  );
}
