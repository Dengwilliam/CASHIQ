import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'About Us | FinQuiz Challenge',
};

export default function AboutPage() {
  const values = [
    { title: 'Education', description: 'Simplifying finance for everyone.' },
    { title: 'Integrity', description: 'Fair play, honest scoring, no cheating.' },
    { title: 'Innovation', description: 'Modern, engaging learning tools.' },
    { title: 'Empowerment', description: 'Helping users make smarter financial decisions.' },
    { title: 'Community', description: 'Growing together through friendly competition.' },
  ];

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16 mt-20 animate-in fade-in-50 duration-500">
        <div className="mx-auto max-w-4xl space-y-12">
          <header className="text-center">
            <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
              About FinQuiz Challenge
            </h1>
            <p className="mt-4 text-base text-foreground/80 max-w-2xl mx-auto">
              Empowering people to learn finance through fun, competition, and rewards.
            </p>
          </header>

          <section id="mission">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Mission</h2>
            <p className="text-base text-foreground/80">
              At FinQuiz Challenge, our mission is to improve financial literacy by making learning simple, exciting, and rewarding. We believe that everyone deserves access to financial knowledge — and we’re using gamification to make that possible.
            </p>
          </section>

          <section id="what-we-do">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What We Do</h2>
            <p className="text-base text-foreground/80">
              We offer weekly financial quiz competitions where players test their knowledge, climb leaderboards, and earn real rewards. Through short quizzes, achievements, and fun challenges, we turn essential financial skills into a competitive game that anyone can enjoy.
            </p>
          </section>

          <section id="why-we-built-this">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why We Built This</h2>
            <p className="text-base text-foreground/80">
              Many young people want to learn how to manage money, invest, budget, and plan for the future — but traditional education is often boring, confusing, or inaccessible. FinQuiz Challenge was created to close this gap by delivering bite-sized financial knowledge in an entertaining and interactive way.
            </p>
          </section>

          <section id="what-makes-us-different">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What Makes Us Different</h2>
            <ul className="space-y-3 text-base text-foreground/80 list-disc list-inside">
              <li><span className="font-semibold">Gamified learning approach</span></li>
              <li><span className="font-semibold">Real cash rewards</span></li>
              <li><span className="font-semibold">Bite-sized financial lessons</span></li>
              <li><span className="font-semibold">Weekly challenges & quizzes</span></li>
              <li><span className="font-semibold">A fair ranking system</span></li>
              <li><span className="font-semibold">Safe, secure wallet and payouts</span></li>
            </ul>
            <p className="mt-4 text-base text-foreground/80 italic">
              FinQuiz Challenge isn’t just another quiz game — it combines learning with real-world rewards, making the journey both educational and motivating.
            </p>
          </section>

          <section id="vision">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Vision</h2>
            <p className="text-base text-foreground/80">
              Our vision is to become Africa’s leading platform for financial education through gamification — helping millions build confidence in money matters while having fun.
            </p>
          </section>
          
          <section id="values">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => (
                <div key={value.title} className="p-6 bg-card rounded-lg border shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section id="founder">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Meet the Founder</h2>
            <p className="text-base text-foreground/80">
              Founded by [Founder's Name], FinQuiz Challenge was built from a passion to improve financial knowledge in a fun and accessible way.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Contact & Sponsorship</h2>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Contact Us</h3>
                  <p><strong>Support:</strong> <a href="mailto:support@finquiz.com" className="text-primary hover:underline">support@finquiz.com</a></p>
                  <p><strong>Website:</strong> <a href="https://finquiz.com" className="text-primary hover:underline">finquiz.com</a></p>
                  <p className="mt-2 text-muted-foreground">Social media pages coming soon!</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Sponsored By</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="secondary">Banks</Badge>
                    <Badge variant="secondary">Fintechs</Badge>
                    <Badge variant="secondary">SACCOs</Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
