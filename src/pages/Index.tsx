import { useApp, AppProvider } from '@/context/AppContext';
import SignInScreen from '@/components/SignInScreen';
import HomeScreen from '@/components/HomeScreen';

const AppContent = () => {
  const { user } = useApp();
  return user ? <HomeScreen /> : <SignInScreen />;
};

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
