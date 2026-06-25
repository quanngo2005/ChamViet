import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import ContactRequestForm from '../common/ContactRequestForm';
import { CONTACT_EMAIL, CONTACT_FACEBOOK_URL, CONTACT_TIKTOK_URL } from '../../data/contact';

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
  { label: 'Facebook', href: CONTACT_FACEBOOK_URL },
  { label: 'TikTok', href: CONTACT_TIKTOK_URL },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const socialLinks = [
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon, href: CONTACT_FACEBOOK_URL },
  { id: 'tiktok', label: 'TikTok', Icon: TiktokIcon, href: CONTACT_TIKTOK_URL },
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
            {"Chạm Việt"}
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
            Nhận thông tin
          </Typography>
          <Typography sx={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.7 }}>
            Để lại lời nhắn để Chạm Việt gửi thêm thông tin cho bạn.
          </Typography>
          <ContactRequestForm
            requestType="info_request"
            submitLabel="Gửi thông tin"
            successMessage="Cảm ơn bạn, Chạm Việt đã nhận thông tin và sẽ phản hồi sớm."
          />
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
          <FooterStaticText label="Privacy Policy" />
          <FooterStaticText label="Terms of Service" />
        </Box>
      </Box>
    </Box>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; to?: string; href?: string }> }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 900, color: 'var(--text-h)' }}>
        {title}
      </Typography>
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {links.map((item) => (
          <FooterTextLink key={item.label} to={item.to} href={item.href} label={item.label} />
        ))}
      </Box>
    </Box>
  );
}

function FooterTextLink({ to, href, label }: { to?: string; href?: string; label: string }) {
  if (href) {
    return (
      <Box
        component="a"
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

  return (
    <Box
      component={RouterLink}
      to={to ?? '/'}
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

function FooterStaticText({ label }: { label: string }) {
  return (
    <Typography sx={{ color: 'var(--text-sub)', fontSize: 13, fontWeight: 600, cursor: 'default' }}>
      {label}
    </Typography>
  );
}
