import { useEffect, useState, type CSSProperties } from 'react';

import beHac from '@assets/be-hac.png';

import { useSmoothScroll, useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';
import { useHomePageData } from '../../../hooks/useHomePageData';

type WorkflowVariant = 'puzzle' | 'scanner' | 'ghost' | 'qa';

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
  screenLabel: string;
  image?: string;
  alt?: string;
  accentColor: string;
  variant: WorkflowVariant;
  fallbackLabel: string;
};

function WorkflowAssetImage({
  src,
  alt,
  fallbackLabel,
  className,
}: {
  src?: string;
  alt?: string;
  fallbackLabel: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError || !src) {
    return (
      <div className={`workflow-visual__fallback ${className ?? ''}`.trim()}>
        <span className="workflow-visual__fallback-label">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      className={`workflow-visual__image ${className ?? ''}`.trim()}
      src={src}
      alt={alt ?? ''}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

function PuzzleVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--puzzle" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
      <div className="workflow-visual__veil" aria-hidden="true" />
      <div className="workflow-visual__pieces" aria-hidden="true">
        <span className="workflow-piece workflow-piece--one" />
        <span className="workflow-piece workflow-piece--two" />
        <span className="workflow-piece workflow-piece--three" />
      </div>
      <div className="workflow-visual__caption">{step.screenLabel}</div>
    </figure>
  );
}

function ScannerVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--scanner" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
      <div className="workflow-visual__scan-board" aria-hidden="true">
        <span className="workflow-visual__scan-corner workflow-visual__scan-corner--tl" />
        <span className="workflow-visual__scan-corner workflow-visual__scan-corner--tr" />
        <span className="workflow-visual__scan-corner workflow-visual__scan-corner--bl" />
        <span className="workflow-visual__scan-corner workflow-visual__scan-corner--br" />
        <span className="workflow-visual__scan-line" />
      </div>
      <div className="workflow-visual__scanner-phone" aria-hidden="true">
        <span className="workflow-visual__scanner-phone-camera" />
        <span className="workflow-visual__scanner-phone-screen" />
      </div>
      <div className="workflow-visual__badge">{step.screenLabel}</div>
    </figure>
  );
}

function GhostVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--ghost" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
      <div className="workflow-visual__veil workflow-visual__veil--ghost" aria-hidden="true" />
      <div className="workflow-visual__ghost-box" aria-hidden="true">
        <div className="workflow-visual__ghost-phone" />
        <div className="workflow-visual__ghost-glow" />
      </div>
      <div className="workflow-visual__badge">{step.screenLabel}</div>
    </figure>
  );
}

function QaVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--qa" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
      <div className="workflow-visual__veil workflow-visual__veil--qa" aria-hidden="true" />
      <div className="workflow-visual__qa-head">
        <img className="workflow-visual__qa-avatar" src={beHac} alt="" aria-hidden="true" />
        <div className="workflow-visual__qa-headcopy">
          <span className="workflow-visual__qa-kicker">AI Story Guide</span>
          <strong>Hỏi đáp và khám phá</strong>
        </div>
      </div>
      <div className="workflow-visual__chat" aria-hidden="true">
        <div className="workflow-visual__bubble workflow-visual__bubble--bot">Bạn muốn hỏi điều gì?</div>
        <div className="workflow-visual__bubble workflow-visual__bubble--user">Kể thêm về câu chuyện này nhé.</div>
        <div className="workflow-visual__bubble workflow-visual__bubble--bot">Mình sẽ dẫn bạn đi tiếp.</div>
      </div>
      <div className="workflow-visual__badge">{step.screenLabel}</div>
    </figure>
  );
}

function WorkflowVisual({ step }: { step: WorkflowStep }) {
  switch (step.variant) {
    case 'scanner':
      return <ScannerVisual step={step} />;
    case 'ghost':
      return <GhostVisual step={step} />;
    case 'qa':
      return <QaVisual step={step} />;
    case 'puzzle':
    default:
      return <PuzzleVisual step={step} />;
  }
}

export default function Workflow() {
  const headRef = useSmoothScroll<HTMLDivElement>();
  const listRef = useSmoothScrollStagger<HTMLDivElement>('.step-card', 150);
  const { copy } = useHomePageData();
  const steps = copy.steps.items as WorkflowStep[];

  return (
    <section className="workflow-section">
      <div className="container">
        <div ref={headRef} className="workflow-section__header scroll-reveal fade-up">
          <p className="section-eyebrow">Hành trình 4 bước</p>
          <h2 className="workflow-section__title">{copy.steps.title}</h2>
          <p className="workflow-section__sub">{copy.steps.description}</p>
        </div>

        <div className="workflow-section__track">
          <div className="workflow-section__connector" aria-hidden="true" />

          <div ref={listRef} className="workflow-section__cards">
            {steps.map((step) => (
              <article
                key={step.number}
                className={`step-card step-card--${step.variant} scroll-reveal-child scale-in`}
                style={{ '--accent-color': step.accentColor } as CSSProperties}
              >
                <div className="step-card__media">
                  <WorkflowVisual step={step} />
                </div>

                <div className="step-card__body">
                  <div className="step-card__meta">
                    <span className="step-card__num">{String(step.number).padStart(2, '0')}</span>
                    <span className="step-card__category">{step.screenLabel}</span>
                  </div>
                  <h4 className="step-card__title">{step.title}</h4>
                  <p className="step-card__desc">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
