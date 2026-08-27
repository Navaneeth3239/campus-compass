import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Lock,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Trash2,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IssueStatusBadge } from "@/components/issues/IssueStatusBadge";
import { PriorityBadge } from "@/components/issues/PriorityBadge";
import { format } from "date-fns";
import { getAuthorizedSession, signOut } from "@/lib/api/auth";
import { useAdminIssues, useAdminIssueStats, useDepartments } from "@/hooks/useAdminIssues";
import { useAuth } from "@/hooks/useAuth";
import {
  useHideIssueMutation,
  useResolveIssueMutation,
  useSoftDeleteIssueMutation,
} from "@/hooks/useIssueMutations";
import type { IssuePriority, IssueStatus } from "@/lib/types/issues";

const STATUS_OPTIONS: Array<IssueStatus | "ALL"> = [
  "ALL",
  "REPORTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "VERIFIED",
  "CLOSED",
  "REOPENED",
  "OVERDUE",
  "ESCALATED",
];

const PRIORITY_OPTIONS: Array<IssuePriority | "ALL"> = ["ALL", "LOW", "MEDIUM", "HIGH"];
const CATEGORY_OPTIONS = ["ALL", "MAINTENANCE", "CLEANING", "IT_SUPPORT", "SECURITY", "LANDSCAPING", "OTHER"];

export const Route = createFileRoute("/admin/issues")({
  beforeLoad: async () => {
    const access = await getAuthorizedSession();
    if (!access.authorized) {
      if (access.session) {
        await signOut();
      }

      throw redirect({
        to: "/admin/login",
        search: { reason: "unauthorized" },
      });
    }
  },
  component: AdminIssuesDashboard,
});

function StatCard({ title, value, trend, trendUp, icon: Icon, iconColor, textColor }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10 text-opacity-100`}>
          <Icon className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-sm font-semibold text-gray-500">{title}</span>
      </div>
      <div>
        <div className={`text-4xl font-bold ${textColor || 'text-gray-900'} mb-2`}>{value}</div>
        <div className={`text-xs font-medium flex items-center ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? '↑' : '↓'} {trend} this week
        </div>
      </div>
    </div>
  );
}

function AdminIssuesDashboard() {
  const { profile, signOut: signOutCurrentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<IssueStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<IssuePriority | "ALL">("ALL");
  const [category, setCategory] = useState<string | "ALL">("ALL");
  const [departmentId, setDepartmentId] = useState<string | "ALL">("ALL");

  const filters = useMemo(
    () => ({
      search,
      status,
      priority,
      category,
      departmentId,
    }),
    [category, departmentId, priority, search, status],
  );

  const issuesQuery = useAdminIssues(filters);
  const statsQuery = useAdminIssueStats();
  const departmentsQuery = useDepartments();
  const resolveIssueMutation = useResolveIssueMutation();
  const hideIssueMutation = useHideIssueMutation();
  const softDeleteIssueMutation = useSoftDeleteIssueMutation();

  const departmentNames = useMemo(() => {
    return new Map((departmentsQuery.data ?? []).map((department) => [department.id, department.name]));
  }, [departmentsQuery.data]);

  const isMutating =
    resolveIssueMutation.isPending || hideIssueMutation.isPending || softDeleteIssueMutation.isPending;

  const issues = issuesQuery.data ?? [];
  const stats = statsQuery.data ?? {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  };

  const handleSignOut = async () => {
    await signOutCurrentUser();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 font-display">Admin Issue Management</h1>
          <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Lock className="w-3 h-3" />
            Secure Admin Console
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-tight">{profile?.name ?? "Administrator"}</div>
              <div className="text-xs text-gray-500">{profile?.role ?? "ADMIN"}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name ?? "Admin User")}&background=0D8ABC&color=fff`} alt="Admin" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="hidden sm:inline-flex rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Issues" value={stats.total} trend="Live" trendUp={true} icon={FileText} iconColor="bg-gray-500" />
          <StatCard title="Pending" value={stats.pending} trend="Live" trendUp={true} icon={Clock} iconColor="bg-amber-500" />
          <StatCard title="In Progress" value={stats.inProgress} trend="Live" trendUp={true} icon={RefreshCw} iconColor="bg-blue-500" />
          <StatCard title="Completed" value={stats.resolved} trend="Live" trendUp={true} icon={CheckCircle2} iconColor="bg-green-500" />
          <StatCard title="Critical Issues" value={stats.critical} trend="Live" trendUp={false} icon={AlertCircle} iconColor="bg-red-500" textColor="text-red-600" />
        </div>

        {/* Issues Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Campus Issues</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and dispatch departments for resolution.</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search issues..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            
            <select value={status} onChange={(event) => setStatus(event.target.value as IssueStatus | "ALL")} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500">
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "Status: All" : option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <select value={priority} onChange={(event) => setPriority(event.target.value as IssuePriority | "ALL")} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500">
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "Priority: All" : option}
                </option>
              ))}
            </select>
            <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500">
              <option value="ALL">Department: All</option>
              {(departmentsQuery.data ?? []).map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500">
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "Category: All" : option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              {isMutating ? "Updating..." : "Filter"}
            </button>
            <button className="inline-flex items-center gap-2 bg-[#0A3019] border border-[#0A3019] px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#082613] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden overflow-x-auto shadow-sm">
          {issuesQuery.isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : issuesQuery.isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600 mb-4">Unable to load issues right now.</p>
              <button
                type="button"
                onClick={() => void issuesQuery.refetch()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No issues yet.</div>
          ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm">
                    {issue.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {issue.ticketId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {issue.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {issue.departmentAssigned ? departmentNames.get(issue.departmentAssigned) ?? issue.departmentAssigned : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <IssueStatusBadge status={issue.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(issue.dateReported), 'dd MMM yyyy hh:mm a')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="View Issue">
                        <Eye className="w-4 h-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="More Actions">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="text-green-600 cursor-pointer focus:text-green-600 focus:bg-green-50"
                            onClick={() => void resolveIssueMutation.mutateAsync(issue.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span>Mark Resolved</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => void hideIssueMutation.mutateAsync(issue.id)}>
                            <EyeOff className="w-4 h-4 mr-2" />
                            <span>Hide from Public</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onClick={() => void softDeleteIssueMutation.mutateAsync(issue.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CampSolver Administrator Console. Confidential & Protected.</p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Security Settings</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
          </div>
        </div>

      </main>
    </div>
  );
}
