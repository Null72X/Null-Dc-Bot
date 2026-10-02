import Link from 'next/link';
import { botIdentity } from '@null-bot/config';
import { Shield, Music, Ticket, Award, Gift, MessageSquare, Zap, Radio, Lock, Sliders } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-dark-border bg-dark-sidebar/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30">
              N
            </div>
            <span className="font-bold text-xl tracking-tight text-white">{botIdentity.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/api/auth/login"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              Login with Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20 inline-block mb-6">
            Production All-in-One Discord System
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            One Bot to Power Your Entire Discord Community
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Replace separate moderation, music, ticket, leveling, giveaway, logging, and security bots with {botIdentity.name}. Feature-rich, customizable, and powered by a sleek Web Dashboard.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/api/auth/login"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all shadow-xl shadow-indigo-600/25 flex items-center gap-3"
            >
              Open Web Dashboard
            </a>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto border-t border-dark-border/50">
          <h2 className="text-3xl font-bold text-center text-white mb-12">17+ Core Modules Included</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Moderation & AutoMod', desc: 'Complete punishment suite with bad words, spam, invites, caps, and fast message burst filters.' },
              { icon: Lock, title: 'Anti-Raid & Anti-Nuke', desc: 'Detect mass channel/role deletion, mass bans, and raid bursts with automated lockdown response.' },
              { icon: Ticket, title: 'Ticket System', desc: 'Multi-category ticket panels, staff notes, claim controls, and HTML transcript generation.' },
              { icon: Music, title: 'Music Engine', desc: 'Queue player with volume control, loop modes, shuffle, seek, and voice connection lifecycle.' },
              { icon: Award, title: 'Leveling & XP', desc: 'Message & voice XP calculations, rank card generator, role rewards, and top server leaderboards.' },
              { icon: Gift, title: 'Giveaways', desc: 'Cryptographically secure winner drawing, entry buttons, role requirements, and persistence.' },
              { icon: MessageSquare, title: 'Welcome & Goodbye', desc: 'Customizable welcome messages with live preview cards and placeholders like {user} and {server}.' },
              { icon: Sliders, title: 'Reaction Roles', desc: 'Create interactive button or select menu role assignment panels directly in Discord.' },
              { icon: Zap, title: 'AutoResponder', desc: 'Exact, contains, and regex pattern trigger responses with channel/role restrictions.' },
            ].map((f, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-indigo-500/50 transition-all">
                <f.icon className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8 text-center text-slate-500 text-sm">
        <p>{botIdentity.footerText}</p>
      </footer>
    </div>
  );
}
