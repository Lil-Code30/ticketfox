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
  Upload
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
              value={0}
              icon={BookOpen}
              description="Knowledge entries in the system"
              featured
            />
            <DashboardMetricCard
              label="Incidents"
              value={0}
              icon={AlertTriangle}
              description="Documented incidents"
            />
            <DashboardMetricCard
              label="Documentation"
              value={0}
              icon={FileText}
              description="Reference documents"
            />
            <DashboardMetricCard
              label="Resources"
              value={0}
              icon={Link2}
              description="External resources"
            />
            <DashboardMetricCard
              label="Notes"
              value={0}
              icon={StickyNote}
              description="Quick notes"
            />
            <DashboardMetricCard
              label="Scripts"
              value={0}
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
            {/* Example with empty state: */}
            <ActivityList items={[]} />
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
