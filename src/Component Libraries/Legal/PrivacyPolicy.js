import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="text"
      >
        Back
      </Button>

      <Paper
        elevation={3}
        sx={(theme) => ({
          p: { xs: 3, sm: 5, md: 6 },
          borderRadius: 3,
          backgroundColor:
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(19, 27, 32, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'divider',
        })}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={(theme) => ({
              display: 'flex',
              p: 1.5,
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === 'light' ? '#E1F8EC' : 'rgba(16, 185, 129, 0.15)',
              color: 'primary.main',
            })}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Privacy Policy
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Otloha Quran Recitation & Tajweed Education Platform
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip label="Effective Date: September 2026" size="small" variant="outlined" />
          <Chip label="GDPR & Meta Platform Compliant" size="small" color="primary" variant="outlined" />
          <Chip label="Version 2.0" size="small" variant="outlined" />
        </Box>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Welcome to <strong>Otloha</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). Otloha is a specialized online platform designed to facilitate Quranic learning, recitation evaluations, and Tajweed education between students, teachers, and educational administrators. We respect your privacy and are committed to safeguarding personal information collected through our website, applications, and related services.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Highlight Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
                  <AccountCircleOutlinedIcon />
                  <Typography variant="h6" fontWeight="bold">
                    Profile Data
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Account identification, contact details, role (student/teacher), and optional demographic preferences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
                  <MicNoneOutlinedIcon />
                  <Typography variant="h6" fontWeight="bold">
                    Audio Recitations
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Audio recordings submitted for Quran recitation practice and teacher evaluation, securely stored in cloud storage.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
                  <DeleteOutlineOutlinedIcon />
                  <Typography variant="h6" fontWeight="bold">
                    Full Control
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  You can edit your profile or request complete deletion of your data and recordings at any time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section 1 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We collect information that you directly provide to us, as well as data received through third-party authentication services you choose to connect:
        </Typography>
        <Typography component="div" variant="body1" sx={{ pl: 2, mb: 3, lineHeight: 1.8 }}>
          <ul>
            <li>
              <strong>Account Registration:</strong> Name, email address, password hash (encrypted with industry-standard bcrypt, never stored in plain text), country, gender, date of birth, interface language, and role (student or teacher).
            </li>
            <li>
              <strong>Third-Party Social Authentication (Facebook / Meta, Google, Twitter):</strong> When you sign in using Facebook Login, Google Sign-In, or Twitter OAuth, we receive the public profile details permitted by your settings, including your third-party user ID, display name, email address (if granted), and profile avatar URL. We never receive or store your social account passwords.
            </li>
            <li>
              <strong>Voice Recordings & Educational Content:</strong> Audio files of Quranic recitations recorded or uploaded by students, along with Surah, Ayah range, teacher evaluation notes, Tajweed ratings, and progress checkpoints.
            </li>
            <li>
              <strong>Operational & Security Logs:</strong> Temporary One-Time Passwords (OTPs) for password reset (automatically invalidated after 5 minutes), signed security tokens, and diagnostic activity logs.
            </li>
          </ul>
        </Typography>

        {/* Section 2 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          2. How We Use Your Information
        </Typography>
        <Typography component="div" variant="body1" sx={{ pl: 2, mb: 3, lineHeight: 1.8 }}>
          <ul>
            <li>To operate and maintain the Otloha recitation review and Tajweed educational services.</li>
            <li>To pair student recitation submissions with qualified teachers for grading, correction, and feedback.</li>
            <li>To authenticate accounts and protect against unauthorized access or duplicate accounts.</li>
            <li>To moderate platform content and maintain a respectful, safe learning environment (including moderation of reported submissions).</li>
            <li>To send important operational notifications, such as password reset links or security alerts.</li>
          </ul>
        </Typography>

        {/* Section 3 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          3. Media & Audio Storage
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Student audio recordings and avatars are securely hosted using Google Cloud Storage (GCS) and protected storage buckets. Access to recitation files is limited to authorized educational purposes (such as evaluation by platform teachers and educational administrators). We do not license, distribute, or sell user audio recordings to third-party commercial vendors.
        </Typography>

        {/* Section 4 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          4. Third-Party Services
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Otloha integrates with verified third-party partners to deliver our service:
        </Typography>
        <Typography component="div" variant="body1" sx={{ pl: 2, mb: 3, lineHeight: 1.8 }}>
          <ul>
            <li><strong>Meta / Facebook:</strong> Used for social authentication. Data handling adheres to the Meta Platform Terms.</li>
            <li><strong>Google Identity & Cloud Storage:</strong> Used for Google OAuth login and secure audio/media asset hosting.</li>
            <li><strong>Twitter (X):</strong> Used for optional OAuth social login.</li>
            <li><strong>Nodemailer / Email Services:</strong> Used to transmit verification codes and password recovery emails.</li>
          </ul>
        </Typography>

        {/* Section 5 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          5. Data Retention & Your Rights (GDPR & Data Protection)
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Under applicable data protection laws (including GDPR and Meta Platform Policies), you possess specific rights regarding your personal information:
        </Typography>
        <Typography component="div" variant="body1" sx={{ pl: 2, mb: 3, lineHeight: 1.8 }}>
          <ul>
            <li><strong>Right of Access & Correction:</strong> You can view and modify your profile details at any time through the platform settings.</li>
            <li><strong>Right to Revoke Permissions:</strong> You can disconnect your Facebook, Google, or Twitter account at any time through their respective account settings.</li>
            <li><strong>Right to Erasure (Data Deletion):</strong> You have the right to request the complete and permanent deletion of your Otloha account, profile data, and all uploaded audio recitations.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          For detailed instructions on removing your Facebook connection or submitting a data deletion request, please visit our dedicated{' '}
          <Link component={RouterLink} to="/user-data-deletion" color="primary" fontWeight="bold">
            User Data Deletion Page
          </Link>.
        </Typography>

        {/* Section 6 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          6. Security Measures
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We employ robust administrative, technical, and physical safeguards designed to protect personal information:
        </Typography>
        <Typography component="div" variant="body1" sx={{ pl: 2, mb: 3, lineHeight: 1.8 }}>
          <ul>
            <li>All data in transit is encrypted using Secure Sockets Layer / Transport Layer Security (TLS/HTTPS).</li>
            <li>User passwords are encrypted with bcrypt salt hashing.</li>
            <li>Authentication and reset tokens use cryptographically signed HMAC-SHA256 signatures with strict expiration times.</li>
          </ul>
        </Typography>

        {/* Section 7 */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
          7. Contact Information
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          If you have questions, comments, or concerns about this Privacy Policy or our privacy practices, please contact us:
        </Typography>
        <Box
          sx={(theme) => ({
            p: 2.5,
            borderRadius: 2,
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid',
            borderColor: 'divider',
          })}
        >
          <Typography variant="body2">
            <strong>Platform:</strong> Otloha (اتلوها) Quran Education
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            <strong>Email:</strong> privacy@otloha.com / support@otloha.com
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            <strong>Data Deletion Requests:</strong>{' '}
            <Link component={RouterLink} to="/user-data-deletion" color="primary">
              otloha.com/user-data-deletion
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
