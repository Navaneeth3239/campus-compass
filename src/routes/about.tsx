import { createFileRoute } from '@tanstack/react-router'
import { LightSiteLayout } from '@/components/campsolver/LightSiteLayout'
import { Lock, FileText, CheckCircle2, ShieldCheck, MapPin, Search } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <LightSiteLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 lg:gap-8">
        
        {/* Left Content Column */}
        <div className="space-y-12">
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0A3019]">
              About CampSolver
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
              CampSolver was founded by a coalition of students and facility managers who
              realized that campus repairs stall not due to neglect, but because of
              communication friction.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-700" />
              Our mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To make campus maintenance and safety issues impossible to ignore. When a broken
              light, flooded corridor, or unsafe walkway is reported, it should be traceable from report
              to repair—with dates and evidence the community can check.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
              How issues stay accountable
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Every approved issue is timestamped.</strong> The reported date and last updated date are both
                  public, so stalled work is immediately visible to everyone.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Status changes are published.</strong> Reviewed, assigned, in progress, and resolved states
                  appear here automatically as they happen in real-time.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Resolutions require evidence.</strong> Campus improvements are shown with before and after
                  photo context, not just a dry 'closed' label.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Aggregate performance is open.</strong> Resolution rates, active teams, and average speed are
                  open to study for the whole campus community.
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Content Column */}
        <div className="lg:pl-8">
          <div className="bg-[#F0FDF4] border border-green-100 rounded-2xl p-8 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-green-700" />
              Privacy statement
            </h3>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              To prevent retaliation, harassment, or social pressure,
              CampSolver strictly removes identifying data from public
              record. Public pages render only the redacted fields approved
              for the public issues view, so the following items are always
              excluded before publication:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">✕</span>
                </div>
                Student name
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">✕</span>
                </div>
                Student email address
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">✕</span>
                </div>
                Student phone number
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">✕</span>
                </div>
                Exact GPS location of a report
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">✕</span>
                </div>
                Internal staff or department comments
              </li>
            </ul>

            <div className="pt-6 border-t border-green-200 text-sm text-gray-600 leading-relaxed">
              Locations are shown only as a general campus area (for example:
              "Central Library, Block B"). Images appear publicly only after they
              have been approved for publication by moderators. Names, emails,
              and exact GPS coordinates are never exposed on public pages.
            </div>
          </div>
        </div>

      </div>
    </LightSiteLayout>
  )
}
