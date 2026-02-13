import { Landmark, WalletCards, PiggyBank, BookOpen, ShieldCheck, Zap, Handshake, Users, Gamepad2, Award, BrainCircuit, Lock } from 'lucide-react';

export const metadata = {
  title: 'About Us | CashIQ',
};

export default function AboutPage() {
  const values = [
    { title: 'Education', description: 'Simplifying finance for everyone.', icon: BookOpen },
    { title: 'Integrity', description: 'Fair play, honest scoring, no cheating.', icon: ShieldCheck },
    { title: 'Innovation', description: 'Modern, engaging learning tools.', icon: Zap },
    { title: 'Empowerment', description: 'Helping users make smarter financial decisions.', icon: Handshake },
    { title: 'Community', description: 'Growing together through friendly competition.', icon: Users },
  ];

  const differentiators = [
      { text: 'Gamified learning approach', icon: Gamepad2 },
      { text: 'Real cash rewards', icon: Award },
      { text: 'Bite-sized financial lessons', icon: BrainCircuit },
      { text: 'Weekly challenges & quizzes', icon: Users },
      { text: 'A fair ranking system', icon: ShieldCheck },
      { text: 'Safe, secure wallet and payouts', icon: Lock },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 animate-in fade-in-50 duration-500">
      <div className="mx-auto max-w-4xl space-y-16">
        <header className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
            About CashIQ
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Empowering people to learn finance through fun, competition, and rewards.
          </p>
        </header>

        <section id="mission">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Our Mission</h2>
          <p className="text-base text-foreground/80 text-center max-w-3xl mx-auto">
            At CashIQ, our mission is to improve financial literacy by making learning simple, exciting, and rewarding. We believe that everyone deserves access to financial knowledge — and we’re using gamification to make that possible.
          </p>
        </section>

        <section id="what-we-do">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">What We Do</h2>
          <p className="text-base text-foreground/80 text-center max-w-3xl mx-auto">
            We offer weekly financial quiz competitions where players test their knowledge, climb leaderboards, and earn real rewards. Through short quizzes, achievements, and fun challenges, we turn essential financial skills into a competitive game that anyone can enjoy.
          </p>
        </section>

        <section id="why-we-built-this">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Why We Built This</h2>
          <p className="text-base text-foreground/80 text-center max-w-3xl mx-auto">
            Many young people want to learn how to manage money, invest, budget, and plan for the future — but traditional education is often boring, confusing, or inaccessible. CashIQ was created to close this gap by delivering bite-sized financial knowledge in an entertaining and interactive way.
          </p>
        </section>

        <section id="what-makes-us-different">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">What Makes Us Different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentiators.map((item) => (
                  <div key={item.text} className="flex items-center gap-4 p-4 bg-card rounded-lg border shadow-sm">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                          <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-semibold text-card-foreground">{item.text}</span>
                  </div>
              ))}
          </div>
        </section>
        
        <section id="values">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 bg-card rounded-lg border shadow-sm text-center transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1">
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="vision">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Our Vision</h2>
          <p className="text-base text-foreground/80 text-center max-w-3xl mx-auto">
            Our vision is to become Africa’s leading platform for financial education through gamification — helping millions build confidence in money matters while having fun.
          </p>
        </section>

        <section id="founder">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Our Story</h2>
          <p className="text-base text-foreground/80 text-center max-w-3xl mx-auto">
            CashIQ was built from a passion to improve financial knowledge in a fun and accessible way, started by a small team dedicated to making financial literacy engaging for everyone.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Contact & Sponsorship</h2>
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-3">Contact Us</h3>
                <p><strong>Support:</strong> <a href="mailto:support@cashiq.com" className="text-primary hover:underline">support@cashiq.com</a></p>
                <p><strong>Website:</strong> <a href="https://cashiq.com" className="text-primary hover:underline">cashiq.com</a></p>
                <p className="mt-2 text-muted-foreground">Social media pages coming soon!</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Sponsored By</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
                      <Landmark className="h-5 w-5 text-secondary-foreground" />
                      <span className="font-semibold text-sm text-secondary-foreground">Banks</span>
                  </div>
                   <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
                      <WalletCards className="h-5 w-5 text-secondary-foreground" />
                      <span className="font-semibold text-sm text-secondary-foreground">Fintechs</span>
                  </div>
                   <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
                      <PiggyBank className="h-5 w-5 text-secondary-foreground" />
                      <span className="font-semibold text-sm text-secondary-foreground">SACCOs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
