export const metadata = {
  title: 'About | Atmoxhere',
  description: 'Learn more about Atmoxhere'
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: '1000' }}>About Atmoxhere</h1>
        
        <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Replace with description
          </p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            Another Example Line 
          </p>
          
          <p>
            Third Example line about Atmoxhere
          </p>
        </div>
      </div>
    </div>
  );
}
