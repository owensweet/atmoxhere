export const metadata = {
  title: 'Privacy Policy | Atmoxhere',
  description: 'Privacy Policy for Atmoxhere'
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: '1000' }}>Privacy Policy</h1>
        
        <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
          <p><strong>Last Updated: July 23, 2025</strong></p>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you:</p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Create an account or make a purchase</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us for customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Types of Personal Information</h2>
          <p>We may collect the following personal information:</p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Name and contact information (email, phone, address)</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Order history and preferences</li>
            <li>Device and browser information</li>
          </ul>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. How We Use Your Information</h2>
          <p>We use your personal information to:</p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Process and fulfill your orders</li>
            <li>Provide customer service and support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Service providers who assist in our operations</li>
            <li>Payment processors for secure transaction handling</li>
            <li>Law enforcement when required by law</li>
          </ul>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>6. Your Rights</h2>
          <p>Under Canadian privacy laws, you have the right to:</p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Request deletion of your personal information (subject to legal requirements)</li>
          </ul>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at [ADD EMAIL].</p>
          
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: '0.8' }}>This Privacy Policy complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable Canadian privacy laws.</p>
        </div>
      </div>
    </div>
  );
}
