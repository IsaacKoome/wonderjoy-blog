import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '14-Day Skincare Routine Tracker | WonderJoy AI',
  description: 'A printable two-week skincare consistency tracker from WonderJoy AI.',
  robots: { index: false, follow: false },
};

const days = Array.from({ length: 14 }, (_, index) => index + 1);

export default function RoutineTrackerPage() {
  return (
    <main className="routine-tracker">
      <header className="routine-tracker__header">
        <p>WonderJoy AI printable</p>
        <h1>My 14-Day Skincare Routine Tracker</h1>
        <span>Consistency first. Change only one product at a time.</span>
      </header>

      <section className="routine-tracker__baseline">
        <label>My main skin goal <span /></label>
        <label>One product I am testing <span /></label>
        <label>My start date <span /></label>
      </section>

      <section className="routine-tracker__grid" aria-label="Fourteen daily tracker cards">
        {days.map((day) => (
          <article key={day} className="routine-tracker__day">
            <h2>Day {day}</h2>
            <div><b>AM</b><span>□ Cleanse/rinse</span><span>□ Moisturize</span><span>□ SPF</span></div>
            <div><b>PM</b><span>□ Cleanse</span><span>□ Treatment</span><span>□ Moisturize</span></div>
            <p>Skin today: □ calm &nbsp; □ dry &nbsp; □ oily &nbsp; □ irritated</p>
            <p>Note: __________________________________</p>
          </article>
        ))}
      </section>

      <section className="routine-tracker__review">
        <h2>Day 14 review</h2>
        <p>What felt better? __________________________________________________________</p>
        <p>What caused discomfort? ____________________________________________________</p>
        <p>What will I keep consistent? _________________________________________________</p>
      </section>

      <footer className="routine-tracker__footer">
        Educational guidance only—not medical advice. Stop a product that causes significant irritation and seek qualified care for persistent or severe concerns.
      </footer>
    </main>
  );
}
