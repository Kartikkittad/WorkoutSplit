import BottomNav from '@/components/BottomNav';
import OnboardingGuard from '@/components/OnboardingGuard';
import BetaBanner from '@/components/BetaBanner';
import AuthGuard from '@/components/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OnboardingGuard>
        <div className="app-container">
          <BetaBanner />
          {children}
          <BottomNav />
        </div>
      </OnboardingGuard>
    </AuthGuard>
  );
}
