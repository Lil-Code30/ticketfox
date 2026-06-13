import { DashboardMetricCard } from "@/components/dashboard-metric-card";
import { ActivityList } from "@/components/activity-list";
import { QuickActionCard } from "@/components/quick-action-card";
import { 
  BookOpen, 
  AlertTriangle, 
  FileText, 
  Link2, 
  StickyNote, 
  Terminal,
  Plus,
  FolderOpen,
  Tag,
  Upload,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import { getDashboardMetrics } from "@/app/actions/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data, success } = await getDashboardMetrics();
  
  const counts = data?.counts || {
    totalEntries: 0,
    incidents: 0,
    documentation: 0,
    resources: 0,
    notes: 0,
    scripts: 0,
  };

  const recentActivity = data?.recentActivity || [];
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-[36px] font-semibold text-text leading-tight tracking-tight">Overview</h1>
        <p className="text-base text-text-muted">System status and knowledge base activity.</p>
      </header>

      {/* Main Grid: left side metrics + activity, right side quick actions */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        
        {/* Left Column: Metrics & Activity (Takes 2/3) */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <DashboardMetricCard
              label="Total Entries"
              value={counts.totalEntries}
              icon={BookOpen}
              description="Knowledge entries in the system"
              featured
            />
            <DashboardMetricCard
              label="Incidents"
              value={counts.incidents}
              icon={AlertTriangle}
              description="Documented incidents"
            />
            <DashboardMetricCard
              label="Documentation"
              value={counts.documentation}
              icon={FileText}
              description="Reference documents"
            />
            <DashboardMetricCard
              label="Resources"
              value={counts.resources}
              icon={Link2}
              description="External resources"
            />
            <DashboardMetricCard
              label="Notes"
              value={counts.notes}
              icon={StickyNote}
              description="Quick notes"
            />
            <DashboardMetricCard
              label="Scripts"
              value={counts.scripts}
              icon={Terminal}
              description="Automation snippets"
            />
          </div>

          {/* Recent Activity */}
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-semibold text-text tracking-tight">Recent Activity</h2>
              <Link href="/knowledge" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                View All
              </Link>
            </div>
            <ActivityList items={recentActivity.map((r: any) => {
              let Icon = FileText;
              switch (r.type) {
                case "INCIDENT": Icon = AlertTriangle; break;
                case "DOCUMENTATION": Icon = FileText; break;
                case "RESOURCE": Icon = Link2; break;
                case "NOTE": Icon = StickyNote; break;
                case "CHECKLIST": Icon = CheckSquare; break;
                case "SCRIPT": Icon = Terminal; break;
              }
              return {
                id: r.id,
                icon: Icon,
                title: r.title,
                type: r.type,
                category: r.category?.name || "Uncategorized",
                date: new Date(r.createdAt).toLocaleDateString(),
              };
            })} />
          </section>

        </div>

        {/* Right Column: Quick Actions (Takes 1/3) */}
        <aside className="flex flex-col gap-4">
          <h2 className="text-[24px] font-semibold text-text tracking-tight">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <QuickActionCard
              title="New Entry"
              description="Create documentation or log an incident"
              icon={Plus}
              href="/knowledge/new"
            />
            <QuickActionCard
              title="Manage Categories"
              description="Organize your knowledge base structure"
              icon={FolderOpen}
              href="/categories"
            />
            <QuickActionCard
              title="Manage Tags"
              description="Add or edit searchable tags"
              icon={Tag}
              href="/tags"
            />
            <QuickActionCard
              title="Upload Files"
              description="Add resources to the knowledge base"
              icon={Upload}
              href="/files"
            />
          </div>
        </aside>

      </div>
    </div>
  );
}
