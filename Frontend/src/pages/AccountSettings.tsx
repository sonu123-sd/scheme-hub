import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Lock, Bell, Shield, Trash2, LogOut, 
  Eye, EyeOff, ChevronLeft, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AccountSettings = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    schemeUpdates: true,
    eligibilityAlerts: true,
    applicationReminders: true,
    newsletter: false,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error(t('settings.allFieldsRequired'));
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error(t('settings.passwordMinLength'));
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('settings.passwordMismatch'));
      return;
    }

    // Verify current password
    const users = JSON.parse(localStorage.getItem('schemeHubUsers') || '[]');
    const currentUser = users.find((u: any) => u.id === user?.id);
    if (!currentUser || currentUser.password !== passwordForm.currentPassword) {
      toast.error(t('settings.incorrectPassword'));
      return;
    }

    // Update password
    currentUser.password = passwordForm.newPassword;
    localStorage.setItem('schemeHubUsers', JSON.stringify(users));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success(t('settings.passwordChanged'));
  };

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem('schemeHubUsers') || '[]');
    const filtered = users.filter((u: any) => u.id !== user?.id);
    localStorage.setItem('schemeHubUsers', JSON.stringify(filtered));
    logout();
    navigate('/');
    toast.success(t('settings.accountDeleted'));
  };

  const handleLogoutAllDevices = () => {
    logout();
    navigate('/login');
    toast.success(t('settings.loggedOutAll'));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('dashboard.title')}
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8" />
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5" />
                {t('settings.changePassword')}
              </CardTitle>
              <CardDescription>{t('settings.changePasswordDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('settings.currentPassword')}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>{t('settings.newPassword')}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>{t('settings.confirmNewPassword')}</Label>
                <Input
                  type="password"
                  className="mt-1"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={handleChangePassword}>
                {t('settings.updatePassword')}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                {t('settings.notifications')}
              </CardTitle>
              <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'schemeUpdates', label: t('settings.schemeUpdates'), desc: t('settings.schemeUpdatesDesc') },
                { key: 'eligibilityAlerts', label: t('settings.eligibilityAlerts'), desc: t('settings.eligibilityAlertsDesc') },
                { key: 'applicationReminders', label: t('settings.applicationReminders'), desc: t('settings.applicationRemindersDesc') },
                { key: 'newsletter', label: t('settings.newsletter'), desc: t('settings.newsletterDesc') },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                {t('settings.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.logoutAllDevices')}</p>
                  <p className="text-xs text-muted-foreground">{t('settings.logoutAllDevicesDesc')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogoutAllDevices}>
                  <LogOut className="h-4 w-4 mr-1" />
                  {t('settings.logout')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {t('settings.dangerZone')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.deleteAccount')}</p>
                  <p className="text-xs text-muted-foreground">{t('settings.deleteAccountDesc')}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('settings.deleteAccount')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('settings.deleteConfirmDesc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {t('settings.deleteAccount')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountSettings;
