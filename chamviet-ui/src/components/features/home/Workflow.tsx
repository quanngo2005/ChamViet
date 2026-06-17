import { useEffect, useState, type CSSProperties } from 'react';
import { Boxes, MessageCircleQuestion, Box, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';

import beHac from '@assets/masotknen.webp';

import { Reveal, RevealItem, StaggerReveal } from '../../common/MotionReveal';
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

const workflowIcons = {
  puzzle: Boxes,
  scanner: ScanLine,
  ghost: Box,
  qa: MessageCircleQuestion,
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
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}



export function PuzzleVisual({ step }: { step: WorkflowStep }) {
  return (
    <motion.figure
      className="workflow-visual workflow-visual--puzzle"
      style={{ '--accent-color': step.accentColor } as CSSProperties}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <WorkflowAssetImage
        src={step.image}
        alt={step.alt}
        fallbackLabel={step.fallbackLabel}
      />
      <div className="workflow-visual__veil" aria-hidden="true" />
      <div className="workflow-visual__badge">{step.screenLabel}</div>
    </motion.figure>
  );
}

function ScannerVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--scanner" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
      <div className="workflow-visual__badge">{step.screenLabel}</div>
    </figure>
  );
}

function GhostVisual({ step }: { step: WorkflowStep }) {
  return (
    <figure className="workflow-visual workflow-visual--ghost" style={{ '--accent-color': step.accentColor } as CSSProperties}>
      <WorkflowAssetImage src={step.image} alt={step.alt} fallbackLabel={step.fallbackLabel} />
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
        <picture>
          <source srcSet={beHac} type="image/webp" />
          <img
            className="workflow-visual__qa-avatar"
            src={beHac}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <div className="workflow-visual__chat" aria-hidden="true">
        <div className="workflow-visual__bubble workflow-visual__bubble--bot">Lạc Long Quân là ai?</div>
        <div className="workflow-visual__bubble workflow-visual__bubble--user">Là một vị thần rất khỏe.</div>
        <div className="workflow-visual__bubble workflow-visual__bubble--bot">Đúng rồi!</div>
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
  const { copy } = useHomePageData();
  const steps = copy.steps.items as WorkflowStep[];

  return (
    <section className="workflow-section">
      <div className="container">
        <Reveal className="workflow-section__header">
          <h2 className="workflow-section__title">Hành trình đánh thức một câu chuyện</h2>
          <p className="workflow-section__sub"> Chỉ với 4 bước, cả một truyền thuyết Việt sẽ sống dậy trước mắt con </p>
        </Reveal>

        <div className="workflow-section__track">
          <div className="workflow-section__connector" aria-hidden="true" />

          <StaggerReveal className="workflow-section__cards">
            {steps.map((step) => (
              (() => {
                const Icon = workflowIcons[step.variant];

                return (
                  <RevealItem
                    key={step.number}
                    as="article"
                    className={`step-card step-card--${step.variant}`}
                    style={{ '--accent-color': step.accentColor } as CSSProperties}
                    variant="scale"
                  >
                    <div className="step-card__media">
                      <WorkflowVisual step={step} />
                    </div>

                    <div className="step-card__body">
                      <div className="step-card__meta">
                        <span className="step-card__identity">
                          <span className="step-card__icon" aria-hidden="true">
                            <Icon size={20} />
                          </span>
                          <span className="step-card__num">{String(step.number).padStart(2, '0')}</span>
                        </span>

                      </div>
                      <h4 className="step-card__title">{step.title}</h4>
                      <p className="step-card__desc">{step.description}</p>
                    </div>
                  </RevealItem>
                );
              })()
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
