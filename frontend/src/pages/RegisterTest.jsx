const RegisterTest = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ maxWidth: '500px', width: '100%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc2626' }}>Floussna</h1>
          <p style={{ fontSize: '18px', color: '#666', marginTop: '8px' }}>فلوسنا</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Page de Test - Inscription</h2>
          <p>Si vous voyez ce message, la page Register se charge correctement.</p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Le problème vient probablement d'une erreur dans le composant Register complet ou dans le contexte d'authentification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterTest;
