import { Link } from "react-router";
import { ArrowRight, Building2, GraduationCap, LayoutDashboard, ListTodo, } from "lucide-react";
import bgImage from "@/imports/gg.png.jpg-1.jpeg";
export function Landing() {
    return (<div className="min-h-screen w-full font-sans bg-white overflow-x-hidden">
      {/* Above the fold (Hero) */}
      <div className="relative min-h-screen w-full flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black/10 absolute inset-0 z-10 pointer-events-none"/>
          <img src={bgImage} alt="BMSIT&M campus photo" className="w-full h-full object-cover"/>
        </div>

        {/* Giant Sky Text (Behind Building effect) */}
        <div className="absolute top-[12%] left-0 right-0 z-10 pointer-events-none flex justify-center">
          <h1 className="font-playfair font-bold text-navy-deep text-[14vw] leading-none tracking-tight text-center drop-shadow-2xl" style={{
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)",
        }}>
            BMSIT&M
          </h1>
        </div>

        {/* Standard Navbar matching the reference image */}
        <header className="w-full z-50 absolute top-0 left-0 right-0 py-6 px-8 lg:px-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-sm shrink-0">
              C
            </div>
            <span className="text-white font-semibold tracking-wide text-lg hidden sm:block">
              CARE
            </span>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#about" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
              About Us
            </a>
            <a href="#how-it-works" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
              How it Works
            </a>
            <a href="#blocks" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
              Blocks
            </a>
            <a href="#contact" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white px-7 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all shadow-sm border border-white/10 backdrop-blur-md">
              Login
            </Link>
          </div>
        </header>

        {/* Center Content (Buttons & Subtitles) */}
        <div className="flex-1 z-20 flex flex-col items-start justify-end pb-24 px-12 lg:px-24 text-left mt-32">
          <div className="max-w-3xl w-full flex flex-col items-start">
            <p className="font-sans font-medium text-[15px] text-white tracking-normal normal-case border-l-[3px] border-accent pl-3 leading-snug mb-3">
              BMS Institute of Technology &amp; Management
            </p>
            <div className="flex flex-col items-start mb-6 mt-1">
              <span className="font-sans font-light text-[25px] text-white/80 leading-snug drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
                Making Campus Problems Visible.
              </span>
              <span className="font-sans font-bold text-[30px] text-white leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] mt-1">
                Solving Them Faster.
              </span>
            </div>
            <div className="flex flex-row justify-start gap-4 mt-6">
              <Link to="/login" className="bg-navy hover:bg-[#111D33] text-white font-sans font-semibold text-[14px] tracking-normal normal-case rounded-md px-6 py-3 shadow-[0_4px_14px_rgba(26,43,74,0.50)] hover:shadow-[0_6px_20px_rgba(26,43,74,0.60)] transition-all duration-150 ease-in-out border-none">
                Report a Problem
              </Link>
              <a href="#how-it-works" className="bg-transparent hover:bg-white/10 text-white font-sans font-medium text-[14px] rounded-md px-6 py-3 border-[1.5px] border-white/60 hover:border-white/85 transition-all duration-150 ease-in-out shadow-none">
                See How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Year Label */}
        <div className="absolute bottom-8 right-12 text-white/80 text-sm font-semibold tracking-widest uppercase flex items-center gap-3 z-20 drop-shadow-md">
          <span>2026</span>
          <span className="w-px h-3 bg-white/60"></span>
          <span>BMSIT&M</span>
        </div>
      </div>

      {/* Below the fold */}
      <div id="how-it-works" className="bg-white py-32 px-8 lg:px-24 border-b border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-navy font-semibold text-3xl mb-4">
              How it works
            </h2>
            <p className="text-ink-muted text-lg max-w-2xl mx-auto">
              A streamlined process from spotting an issue to final resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-line z-0"/>

            {[
            {
                num: "1",
                title: "Spot it",
                desc: "Notice a broken switch, damaged bench, dirty corridor",
            },
            {
                num: "2",
                title: "Report it",
                desc: "Select the block, space, and describe the issue",
            },
            {
                num: "3",
                title: "It routes automatically",
                desc: "Block staff or admin gets notified instantly",
            },
            {
                num: "4",
                title: "Tracked until fixed",
                desc: "Follow your report's status until it's resolved",
            },
        ].map((step, i) => (<div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-navy text-navy font-bold flex items-center justify-center text-xl mb-6 shadow-sm">
                  {step.num}
                </div>
                <h3 className="font-semibold text-ink text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </div>))}
          </div>
        </div>
      </div>

      {/* Role Showcase */}
      <div className="bg-page-bg py-32 px-8 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Students */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-line flex flex-col gap-6 transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3 text-navy mb-2">
              <GraduationCap className="w-6 h-6"/>
              <h3 className="font-semibold text-xl">Students</h3>
            </div>
            <div className="bg-page-bg p-5 rounded-lg border border-line flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">My Reports</span>
              </div>

              <div className="bg-white p-3 rounded border border-line flex justify-between items-start shadow-sm">
                <div>
                  <p className="text-xs font-bold text-ink mb-1">
                    Block B, Room 204
                  </p>
                  <p className="text-[11px] text-ink-muted">Fan not working</p>
                </div>
                <span className="bg-warning/20 text-warning px-2 py-0.5 rounded text-[10px] font-medium border border-warning/10">
                  In Progress
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-line flex justify-between items-start shadow-sm">
                <div>
                  <p className="text-xs font-bold text-ink mb-1">Washroom F2</p>
                  <p className="text-[11px] text-ink-muted">Tap broken</p>
                </div>
                <span className="bg-open-grey/10 text-open-grey px-2 py-0.5 rounded text-[10px] font-medium border border-open-grey/10">
                  Open
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-line flex justify-between items-start shadow-sm opacity-60">
                <div>
                  <p className="text-xs font-bold text-ink mb-1">Lab 301</p>
                  <p className="text-[11px] text-ink-muted">Projector issue</p>
                </div>
                <span className="bg-success/20 text-success px-2 py-0.5 rounded text-[10px] font-medium border border-success/10">
                  Resolved
                </span>
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-line flex flex-col gap-6 transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3 text-navy mb-2">
              <ListTodo className="w-6 h-6"/>
              <h3 className="font-semibold text-xl">Block Staff</h3>
            </div>
            <div className="bg-page-bg p-5 rounded-lg border border-line flex flex-col gap-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">Block B Queue</span>
                <span className="text-[10px] bg-navy text-white px-2 py-0.5 rounded">
                  4 Open
                </span>
              </div>

              {[1, 2, 3].map((i) => (<div key={i} className="bg-white p-3 rounded border border-line flex justify-between items-center shadow-sm">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-ink mb-1">
                      Room {200 + i}
                    </p>
                    <p className="text-[11px] text-ink-muted truncate w-[120px]">
                      Electrical issue reported...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-info bg-info/10 px-1.5 py-0.5 rounded">
                      +4
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted"/>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Admin */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-line flex flex-col gap-6 transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3 text-navy mb-2">
              <LayoutDashboard className="w-6 h-6"/>
              <h3 className="font-semibold text-xl">Admin</h3>
            </div>
            <div className="bg-page-bg p-5 rounded-lg border border-line flex flex-col gap-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">Block Leaderboard</span>
              </div>

              <div className="flex flex-col gap-3">
                {[
            { name: "Block A", score: 91, w: "91%" },
            { name: "Block B", score: 84, w: "84%" },
            { name: "Block C", score: 76, w: "76%" },
        ].map((block, i) => (<div key={i} className="bg-white p-3 rounded border border-line flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{block.name}</span>
                      <span className={i === 0 ? "text-success" : "text-ink"}>
                        {block.score}
                      </span>
                    </div>
                    <div className="w-full bg-line h-1.5 rounded-full overflow-hidden">
                      <div className="bg-navy h-full rounded-full" style={{ width: block.w }}></div>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Strip */}
      <div className="bg-navy-deep text-white py-16 px-8 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
          <div className="text-center">
            <p className="text-4xl font-semibold mb-2 text-accent">87%</p>
            <p className="text-white/70 text-sm tracking-wide uppercase">
              Reports resolved within SLA
            </p>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20"></div>
          <div className="text-center">
            <p className="text-4xl font-semibold mb-2">2.4 days</p>
            <p className="text-white/70 text-sm tracking-wide uppercase">
              Avg. resolution time
            </p>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20"></div>
          <div className="text-center">
            <p className="text-4xl font-semibold mb-2 flex items-center justify-center gap-2">
              6 <Building2 className="w-6 h-6 text-white/50"/>
            </p>
            <p className="text-white/70 text-sm tracking-wide uppercase">
              Blocks tracked across campus
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-8 lg:px-24 border-t border-line">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-navy text-white font-bold flex items-center justify-center text-sm rounded-sm">
              C
            </div>
            <div>
              <p className="font-semibold text-navy">BMSIT&M</p>
              <p className="text-ink-muted text-xs">
                Campus Infrastructure Complaint System — VTU Project
              </p>
            </div>
          </div>
          <div className="text-ink-muted text-sm flex gap-6">
            <a href="#" className="hover:text-navy">
              Privacy
            </a>
            <a href="#" className="hover:text-navy">
              Terms
            </a>
            <a href="#" className="hover:text-navy">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>);
}
