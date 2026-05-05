import { Mail } from 'lucide-react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-container)', padding: '100px 0 60px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '64px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
              fontSize: '24px',
              fontWeight: 900,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '-1px'
          }}>
            Chạm Việt
          </div>
          <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6' }}>
            Gìn giữ nét Việt trong từng món đồ chơi. Kết nối di sản qua công nghệ tương tác, đánh thức mọi giác quan.
          </p>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--secondary)', marginTop: '8px' }}>
            <FacebookIcon style={{ fontSize: 24, cursor: 'pointer', transition: 'color 0.3s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--secondary)'}/>
            <InstagramIcon style={{ fontSize: 24, cursor: 'pointer', transition: 'color 0.3s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--secondary)'}/>
            <YouTubeIcon style={{ fontSize: 24, cursor: 'pointer', transition: 'color 0.3s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--secondary)'}/>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, color: 'var(--text-h)' }}>Sản phẩm</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Bộ Puzzle Gỗ 3D', 'App Chạm Việt', 'Phụ kiện', 'Quà tặng'].map((item) => (
              <li key={item} style={{ color: 'var(--text)', fontSize: '15px', cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text)'}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, color: 'var(--text-h)' }}>Hỗ trợ</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Hướng dẫn SD', 'Chính sách bảo hành', 'Vận chuyển', 'Liên hệ'].map((item) => (
              <li key={item} style={{ color: 'var(--text)', fontSize: '15px', cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text)'}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, color: 'var(--text-h)' }}>Bản tin</h4>
          <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6' }}>Nhận thông báo về các bộ sưu tập mới nhất và câu chuyện di sản.</p>
          <div style={{ display: 'flex', boxShadow: 'var(--shadow-sm)', borderRadius: '12px', overflow: 'hidden' }}>
            <input
              type="text"
              placeholder="Email của bạn"
              style={{
                background: 'white',
                border: 'none',
                padding: '12px 16px',
                width: '100%',
                outline: 'none',
                fontSize: '15px',
                color: 'var(--text-h)'
              }}
            />
            <button style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}>
              <Mail size={20} />
            </button>
          </div>
        </div>

      </div>

      <div className="container" style={{ 
        marginTop: '80px', 
        paddingTop: '32px', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '24px',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '12px', 
        fontWeight: 700, 
        letterSpacing: '1px', 
        color: 'var(--text-sub)',
        opacity: 0.8
      }}>
        <span>© 2024 CHẠM VIỆT. ALL RIGHTS RESERVED.</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.3s ease' }}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>PRIVACY POLICY</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.3s ease' }}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>TERMS OF SERVICE</a>
        </div>
      </div>
    </footer>
  );
}
