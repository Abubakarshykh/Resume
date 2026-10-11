import { EXPERIENCE } from "@/lib/data";
import { Blobs, GlassCard, SectionHeader } from "../ui";

export default function Journey() {
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <Blobs
        items={[
          { color: "honey", x: "38%", y: "-6%", size: 640 },
          { color: "caramel", x: "-10%", y: "55%", size: 760 },
          { color: "stone", x: "70%", y: "62%", size: 560 },
        ]}
      />
      <div className="wrap">
        <SectionHeader eyebrow="Journey" title="Where I have built things" id="journey-title" />
        <div className="journey__grid">
          <div className="journey__col">
            {EXPERIENCE.map((e) => (
              <GlassCard key={e.title + e.date} as="article" className="exp">
                <div>
                  <span className="exp__bar" style={{ background: e.accent }} aria-hidden="true" />
                  <p className="exp__date">{e.date}</p>
                </div>
                <div>
                  <h3 className="exp__title">{e.title}</h3>
                  <p className="exp__org">{e.org}</p>
                  <ul className="exp__list">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="journey__col">
            <div className="side side--dark">
              <p className="side__eyebrow">Education</p>
              <p className="side__big">BSCS at NUTECH</p>
              <p className="side__sub">National University of Technology, Islamabad</p>
              <p className="side__years">2024 - 2028</p>
            </div>
            <GlassCard className="side">
              <p className="side__eyebrow">Leadership</p>
              <div className="stats">
                <div>
                  <p className="stat__num">450+</p>
                  <p className="stat__txt">students led on university tours</p>
                </div>
                <div>
                  <p className="stat__num">200+</p>
                  <p className="stat__txt">entrepreneurs at a technology summit I coordinated</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="side">
              <p className="side__eyebrow">Languages</p>
              <p className="side__lang">
                English<span aria-hidden="true">·</span>
                <span className="sr-only-text">and </span>Urdu
              </p>
              <p className="side__sub" style={{ color: "var(--secondary)" }}>
                Both fluent
              </p>
            </GlassCard>
            <div className="side side--honey">
              <p className="side__eyebrow">Availability</p>
              <p className="side__big">
                Open to full-time
                <br />
                or contract work
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
