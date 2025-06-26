import { ClemmontDashboard } from '@/components/clemmont/dashboard';
import { LanguageProvider } from '@/context/language-context';

export default function Home() {
  return (
    <LanguageProvider>
      <ClemmontDashboard />
    </LanguageProvider>
  );
}
