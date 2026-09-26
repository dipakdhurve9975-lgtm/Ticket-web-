import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { User, Bell, Sliders, Camera } from 'lucide-react';
import { cn } from '@/utils/cn';

type TabType = 'profile' | 'notifications' | 'preferences';

export function ProfileSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ] as const;

  const [notificationSettings, setNotificationSettings] = useState({
    emailAll: true,
    ticketAssigned: true,
    statusChanged: true,
    newComment: true,
    criticalAlerts: true
  });

  const Toggle = ({ checked, onChange, label, description }: any) => (
    <div className="flex items-start justify-between py-4">
      <div>
        <h4 className="text-sm font-medium text-surface-900">{label}</h4>
        <p className="text-sm text-surface-500 mt-0.5">{description}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2",
          checked ? "bg-brand-600" : "bg-surface-200"
        )}
      >
        <span 
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Settings</h1>
        <p className="text-surface-500 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    isActive 
                      ? "bg-brand-50 text-brand-700" 
                      : "text-surface-700 hover:bg-surface-100 hover:text-surface-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-brand-700" : "text-surface-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and photo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar name={user?.name || ''} src={user?.avatar} size="lg" className="h-20 w-20 text-2xl" />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-surface-200 rounded-full shadow-sm text-surface-600 hover:text-brand-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-surface-900">Profile Photo</h3>
                    <p className="text-xs text-surface-500 mt-1 mb-2">JPG, GIF or PNG. Max size of 800K</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change</Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    defaultValue={user?.name} 
                    placeholder="John Doe"
                  />
                  <Input 
                    label="Email Address" 
                    defaultValue={user?.email} 
                    disabled 
                    helperText="Contact admin to change email"
                  />
                  <Select 
                    label="Department" 
                    defaultValue={user?.department}
                    options={[
                      { value: 'IT', label: 'IT' },
                      { value: 'HR', label: 'Human Resources' },
                      { value: 'FINANCE', label: 'Finance' },
                      { value: 'SALES', label: 'Sales' },
                      { value: 'SUPPORT', label: 'Customer Support' }
                    ]}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Role</label>
                    <div className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-md text-surface-500 text-sm">
                      {user?.role}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-surface-100 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about updates.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-surface-100">
                <Toggle 
                  label="Email Notifications" 
                  description="Receive notifications via email in addition to in-app alerts."
                  checked={notificationSettings.emailAll}
                  onChange={(v: boolean) => setNotificationSettings({...notificationSettings, emailAll: v})}
                />
                <Toggle 
                  label="Ticket Assigned" 
                  description="Get notified when a new ticket is assigned to you."
                  checked={notificationSettings.ticketAssigned}
                  onChange={(v: boolean) => setNotificationSettings({...notificationSettings, ticketAssigned: v})}
                />
                <Toggle 
                  label="Status Updates" 
                  description="Get notified when the status of your reported or assigned tickets changes."
                  checked={notificationSettings.statusChanged}
                  onChange={(v: boolean) => setNotificationSettings({...notificationSettings, statusChanged: v})}
                />
                <Toggle 
                  label="New Comments" 
                  description="Get notified when someone comments on your tickets."
                  checked={notificationSettings.newComment}
                  onChange={(v: boolean) => setNotificationSettings({...notificationSettings, newComment: v})}
                />
                {(user?.role === 'ADMIN' || user?.role === 'AGENT') && (
                  <Toggle 
                    label="Critical Alerts" 
                    description="Immediate notifications for new CRITICAL priority tickets."
                    checked={notificationSettings.criticalAlerts}
                    onChange={(v: boolean) => setNotificationSettings({...notificationSettings, criticalAlerts: v})}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Customize your workspace experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select 
                  label="Theme" 
                  defaultValue="light"
                  options={[
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode (Coming Soon)' },
                    { value: 'system', label: 'System Default' }
                  ]}
                  disabled
                  helperText="Only Light Mode is currently supported."
                />
                
                <Select 
                  label="Default Dashboard View" 
                  defaultValue="default"
                  options={[
                    { value: 'default', label: 'Role Default' },
                    { value: 'queue', label: 'Priority Queue' },
                    { value: 'my-tickets', label: 'My Tickets' }
                  ]}
                />

                <Select 
                  label="Items Per Page" 
                  defaultValue="10"
                  options={[
                    { value: '10', label: '10 Items' },
                    { value: '25', label: '25 Items' },
                    { value: '50', label: '50 Items' }
                  ]}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-surface-100 pt-4">
                <Button variant="primary">Save Preferences</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
