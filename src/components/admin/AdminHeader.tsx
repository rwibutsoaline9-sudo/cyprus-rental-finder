import { useTranslation } from 'react-i18next';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const AdminHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd handle logout here
    navigate('/');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">{t('admin.dashboard')}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span>Administrator</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          {t('admin.signOut')}
        </Button>
      </div>
    </header>
  );
};