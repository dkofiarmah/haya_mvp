import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanySettings } from "@/components/settings/company-settings"
import { TeamMembers } from "@/components/settings/team-members"
import { BrandingSettings } from "@/components/settings/branding-settings"
import { SubscriptionSettings } from "@/components/settings/subscription-settings"
import { ApiSettings } from "@/components/settings/api-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings, team members, branding, and subscription.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="space-y-4">
          <CompanySettings />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamMembers />
        </TabsContent>
        <TabsContent value="branding" className="space-y-4">
          <BrandingSettings />
        </TabsContent>
        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionSettings />
        </TabsContent>
        <TabsContent value="api" className="space-y-4">
          <ApiSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
