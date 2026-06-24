import type { CSSProperties } from 'react';
import { Sparkles, Boxes, ScanLine, PlayCircle, MessageCircleQuestion, type LucideIcon } from 'lucide-react';
import { HOME_COPY } from '../../../data/home';
import '../../../pages/HowToPlayPage.css';

const workflowIcons: Record<string, LucideIcon> = {
  puzzle: Boxes,
  scanner: ScanLine,
  ghost: PlayCircle,
  qa: MessageCircleQuestion,
};

export default function Workflow() {
  return (
    <section className="how-play-steps">
      <div className="container">
        <div className="how-play-section-head">
          <h2>{HOME_COPY.steps.title}</h2>
          <p>{HOME_COPY.steps.description}</p>
        </div>

        <div className="how-play-step-grid">
          {HOME_COPY.steps.items.map((step) => {
            const Icon = workflowIcons[step.variant] ?? Sparkles;

            return (
              <article
                key={step.number}
                className={`how-play-step-card how-play-step-card--${step.variant}`}
                style={{ '--accent-color': step.accentColor } as CSSProperties}
              >
                <div className="how-play-step-card__media">
                  <picture>
                    <img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
                  </picture>
                  <div className="how-play-step-card__veil" aria-hidden="true" />
                  <span className="how-play-step-card__badge">{step.screenLabel}</span>
                </div>

                <div className="how-play-step-card__body">
                  <div className="how-play-step-card__meta">
                    <span className="how-play-step-card__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className="how-play-step-card__num">
                      {String(step.number).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
