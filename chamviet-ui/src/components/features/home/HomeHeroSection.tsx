import { motion } from 'motion/react';
import { ArrowRight, PlayCircle, Sparkles, Smartphone } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero container" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '80px'
    }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.15)',
          color: 'var(--secondary)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '8px 24px',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '32px'
        }}>
          <Sparkles size={16} style={{ color: 'var(--accent-color)' }} />
          <span>Trải nghiệm văn hóa đa giác quan</span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(48px, 5vw, 72px)', 
          lineHeight: '1.1',
          marginBottom: '32px',
          color: 'var(--text-h)',
          fontWeight: 700,
          letterSpacing: '-1px'
        }}>
          Chạm vào cổ tích <br />
          <span style={{ 
            color: 'var(--primary)', 
            fontStyle: 'italic',
            display: 'inline-block',
            marginTop: '8px'
          }}>Đánh thức giác quan</span>
        </h1>

        <p style={{ 
          fontSize: 'clamp(18px, 1.5vw, 22px)', 
          color: 'var(--text)', 
          maxWidth: '520px', 
          marginBottom: '48px',
          lineHeight: '1.6'
        }}>
          Sự kết hợp hoàn hảo giữa đồ chơi gỗ truyền thống và công nghệ AI tương tác. Khơi dậy tình yêu văn hóa Việt trong mỗi đứa trẻ qua từng điểm chạm.
        </p>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '18px', 
              fontWeight: 500,
              padding: '12px 32px', 
              borderRadius: '4px',
              border: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <span>Sở hữu ngay</span>
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'transparent',
              color: 'var(--text-h)',
              border: '1px solid var(--secondary)',
              fontSize: '18px',
              fontWeight: 500,
              padding: '12px 32px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <PlayCircle size={20} />
            <span>Xem video</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        style={{ position: 'relative' }}
      >
        {/* Organic Background Shape for Wow Factor */}
        <div className="organic-shape" style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(circle, rgba(198,40,40,0.08) 0%, rgba(212,175,55,0.05) 100%)',
          borderRadius: '50% 40% 60% 40% / 40% 50% 40% 60%',
          filter: 'blur(30px)',
          animation: 'morph 8s ease-in-out infinite'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '8px solid white'
        }}>
          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1513682121497-80211f36a7d3?auto=format&fit=crop&q=80&w=1000"
            alt="Hologram Puzzle Experience"
            style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
          />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              background: 'rgba(253, 251, 247, 0.95)',
              backdropFilter: 'blur(12px)',
              padding: '20px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Smartphone size={28} />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Công nghệ</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-h)' }}>AR & Hologram Tương tác</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
