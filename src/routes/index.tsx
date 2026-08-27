import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/campsolver/SiteLayout";
import { ArrowRight, PlusCircle, Search, Map as MapIcon, SlidersHorizontal, CheckCircle2, Clock } from "lucide-react";
import { PublicIssueCard } from "@/components/campsolver/PublicIssueCard";
import { Button } from "@/components/ui/button";
import { useCampusCounters, useCampusIssues, useCampusStatistics } from "@/hooks/useCampusData";
import type { Priority, PublicIssue } from "@/lib/campsolver/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampSolver — Public Campus Issue Transparency" },
    ],
  }),
  component: HomePage,
});

function StatCard({ title, value, trend, trendUp, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className={`text-xs font-medium mt-1 flex items-center ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? '↑' : '↓'} {trend} this week
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-72 rounded-xl border border-gray-100 bg-white animate-pulse" />
      ))}
    </div>
  );
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getMarkerStyle(location: string, index: number) {
  const hash = hashString(`${location}-${index}`);
  return {
    top: `${18 + (hash % 50)}%`,
    left: `${12 + ((hash >> 3) % 70)}%`,
  };
}

function getMarkerClass(issue: PublicIssue) {
  if (["RESOLVED", "VERIFIED", "CLOSED"].includes(issue.status)) {
    return "bg-green-500 ring-green-100";
  }

  if (issue.priority === "HIGH") {
    return "bg-red-500 ring-red-100";
  }

  if (issue.priority === "MEDIUM") {
    return "bg-amber-500 ring-amber-100";
  }

  return "bg-blue-500 ring-blue-100";
}

function HomePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const issuesQuery = useCampusIssues({ q: search, status, priority });
  const countersQuery = useCampusCounters();
  const statisticsQuery = useCampusStatistics();

  const issues = useMemo(
    () => issuesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [issuesQuery.data],
  );

  const mapIssues = useMemo(() => {
    const seen = new Set<string>();
    return issues
      .filter((issue) => {
        if (!issue.location || seen.has(issue.location)) {
          return false;
        }

        seen.add(issue.location);
        return true;
      })
      .slice(0, 6);
  }, [issues]);

  const counters = countersQuery.data;
  const statistics = statisticsQuery.data;
  const totalIssues = counters?.totalPublicIssues ?? counters?.totalIssues ?? issuesQuery.data?.pages[0]?.total ?? 0;
  const resolutionRate = statistics?.resolutionRate.ratePercent ?? 0;
  const topCategory = statistics?.byCategory[0]?.category ?? "No data yet";
  const topLocation = statistics?.mostImprovedLocations[0]?.location ?? "No data yet";

  const isLoading = issuesQuery.isLoading || countersQuery.isLoading || statisticsQuery.isLoading;
  const isError = issuesQuery.isError || countersQuery.isError || statisticsQuery.isError;

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-[#0A3019] text-white pt-16 pb-24 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
              Public transparency record — no login required
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Campus Issues,<br/>Visible to Everyone.
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-lg leading-relaxed">
              See reported problems across campus, track their progress, and know when they are resolved. Student details stay private; accountability stays public.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/report" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FBBF24] text-[#0A3019] px-6 py-3 font-semibold hover:bg-yellow-400 transition-colors">
                <PlusCircle className="w-5 h-5" />
                Report an Issue
              </Link>
              <Link to="/track" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 transition-colors">
                <Search className="w-5 h-5" />
                Track My Issue
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            {/* Visual representation / Illustration placeholder */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A3019] to-transparent opacity-50"></div>
              <div className="flex gap-4 items-end justify-center w-full h-full p-8 opacity-80">
                <div className="w-1/4 h-1/2 bg-white/20 rounded-t-lg"></div>
                <div className="w-1/3 h-3/4 bg-white/30 rounded-t-lg relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 p-2 rounded-full border-2 border-[#0A3019]">
                    <span className="w-3 h-3 block bg-white rounded-full"></span>
                  </div>
                </div>
                <div className="w-1/4 h-2/3 bg-white/20 rounded-t-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-20 pb-20">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <StatCard title="Public Issues" value={totalIssues} trend="Public feed" trendUp icon={MapIcon} colorClass="bg-gray-500" />
          <StatCard title="Resolved" value={counters?.issuesResolved ?? 0} trend="Completed" trendUp icon={CheckCircle2} colorClass="bg-green-500" />
          <StatCard title="Resolution Rate" value={`${resolutionRate}%`} trend="All time" trendUp icon={SlidersHorizontal} colorClass="bg-blue-500" />
          <StatCard title="Avg. Resolution" value={`${counters?.avgResolutionHours ?? 0}h`} trend="Reported average" trendUp icon={Clock} colorClass="bg-amber-500" />
          <StatCard title="Departments" value={counters?.activeDepartments ?? 0} trend="Active teams" trendUp icon={MapIcon} colorClass="bg-red-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Issues List */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reported Campus Issues</h2>
              <p className="text-gray-500 mt-1">Explore issues reported by students and track their real-time status.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative flex-grow min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="bg-gray-50 border-none rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-green-500">
                <option value="ALL">Status: All</option>
                <option value="REPORTED">Reported</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="VERIFIED">Verified</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select className="bg-gray-50 border-none rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-green-500">
                <option>Department: All</option>
              </select>
              <select value={priority} onChange={(event) => setPriority(event.target.value as Priority | "ALL")} className="bg-gray-50 border-none rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-green-500">
                <option value="ALL">Priority: All</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Issue Cards */}
            {isLoading ? (
              <DashboardSkeleton />
            ) : isError ? (
              <div className="rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-red-600 mb-4">Unable to load the public issue feed right now.</p>
                <Button variant="outline" onClick={() => { void issuesQuery.refetch(); void countersQuery.refetch(); void statisticsQuery.refetch(); }}>
                  Retry
                </Button>
              </div>
            ) : issues.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                No issues yet.
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map(issue => (
                  <PublicIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
            
            <div className="pt-4">
              {issuesQuery.hasNextPage ? (
                <Button
                  variant="outline"
                  className="w-full md:w-auto text-gray-600 border-gray-200"
                  onClick={() => void issuesQuery.fetchNextPage()}
                  disabled={issuesQuery.isFetchingNextPage}
                >
                  {issuesQuery.isFetchingNextPage ? "Loading..." : "Load More Issues"}
                </Button>
              ) : null}
            </div>
          </div>

          {/* Right Column: Side Panels */}
          <div className="space-y-6">
            {/* Live Campus Map */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Live Campus Issue Map</h3>
              <div className="aspect-[4/3] bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center relative overflow-hidden mb-4">
                 <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                 {mapIssues.map((issue, index) => (
                   <div
                     key={`${issue.ticketId}-${issue.location}`}
                     className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ${getMarkerClass(issue)}`}
                     style={getMarkerStyle(issue.location, index)}
                     title={issue.location}
                   />
                 ))}
              </div>
              <div className="flex gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span> Critical</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span> High</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> Resolved</span>
              </div>
            </div>

            {/* AI Intelligence */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">AI Issue Intelligence</h3>
                <span className="text-xs font-bold text-green-600 uppercase">Live data</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Top reported category</span>
                  <span className="font-semibold text-gray-900">{topCategory}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Most affected location</span>
                  <span className="font-semibold text-gray-900 text-right">{topLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Weekly reporting trend</span>
                  <span className="font-semibold text-green-600">
                    {resolutionRate}% resolved
                  </span>
                </div>
              </div>
            </div>

            {/* Process Flow */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">No More Lost Complaints</h3>
              
              <div className="flex justify-between items-center mb-6 px-2 relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-6 before:right-6 before:h-0.5 before:bg-gray-100 before:z-0">
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500">Report</span>
                </div>
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500">Review</span>
                </div>
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500">Assign</span>
                </div>
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <MapIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500">Repair</span>
                </div>
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-900">Resolved</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed text-center">
                Every issue receives a unique tracking ID and remains public until the repair is verified with photo evidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
