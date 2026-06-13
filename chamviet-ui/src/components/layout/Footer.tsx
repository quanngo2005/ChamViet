import { Link as RouterLink } from 'react-router-dom';
import { Mail } from 'lucide-react';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

function TiktokIcon(props: any) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </SvgIcon>
  );
}

const productLinks = [
  { label: 'Chạm Việt Box', to: '/products' },
  { label: 'Mở câu chuyện', to: '/story' },
  { label: 'Quét tranh', to: '/scan' },
  { label: 'Cách chơi', to: '/how-to-play' },
];

const supportLinks = [
  { label: 'Giới thiệu', to: '/about' },
  { label: 'Cách chơi', to: '/how-to-play' },
  { label: 'Câu chuyện', to: '/story' },
  { label: 'Liên hệ', to: '/about' },
];

const socialLinks = [
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon, href: 'https://www.facebook.com/chammotcauchuyen' },
  { id: 'instagram', label: 'TikTok', Icon: TiktokIcon, href: 'https://www.tiktok.com/' },
  { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon, href: 'https://www.youtube.com/' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, rgba(253, 251, 247, 0.82), var(--bg-container))',
        borderTop: '1px solid var(--border)',
        pt: { xs: 8, md: 12 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Box
        className="container"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr 0.8fr 1.1fr' },
          gap: { xs: 5, md: 8 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography sx={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', letterSpacing: 0 }}>
            Chạm Việt
          </Typography>
          <Typography sx={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
            Chạm một câu chuyện, Nhớ một Việt Nam
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map(({ id, label, Icon, href }) => (
              <IconButton
                key={id}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  color: 'var(--secondary)',
                  border: '1px solid rgba(78, 52, 46, 0.10)',
                  '&:hover': { color: 'var(--primary)', backgroundColor: 'rgba(198, 40, 40, 0.06)' },
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>

        <FooterColumn title="Sản phẩm" links={productLinks} />
        <FooterColumn title="Hỗ trợ" links={supportLinks} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 900, color: 'var(--text-h)' }}>
            Bản tin
          </Typography>
          <Typography sx={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.7 }}>
            Nhận thông báo về bộ sưu tập mới.
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Email của bạn"
              aria-label="Email nhận bản tin"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              aria-label="Đăng ký bản tin"
              sx={{ minWidth: 48, borderRadius: '8px', px: 1.5 }}
            >
              <Mail size={19} />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        className="container"
        sx={{
          mt: { xs: 6, md: 10 },
          pt: 4,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-sub)',
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em' }}>
          © 2026 CHẠM VIỆT. ALL RIGHTS RESERVED.
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 } }}>
          <FooterTextLink to="/about" label="Privacy Policy" />
          <FooterTextLink to="/about" label="Terms of Service" />
        </Box>
      </Box>
    </Box>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 900, color: 'var(--text-h)' }}>
        {title}
      </Typography>
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {links.map((item) => (
          <FooterTextLink key={item.label} to={item.to} label={item.label} />
        ))}
      </Box>
    </Box>
  );
}

function FooterTextLink({ to, label }: { to: string; label: string }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        width: 'fit-content',
        color: 'var(--text)',
        fontSize: 15,
        fontWeight: 600,
        textDecoration: 'none',
        '&:hover': { color: 'var(--primary)' },
      }}
    >
      {label}
    </Box>
  );
}
