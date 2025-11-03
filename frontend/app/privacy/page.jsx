export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            When you sign in with Google or GitHub, we collect:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Your name and email address</li>
            <li>Your profile picture (if available)</li>
            <li>Betting scenarios you create using our platform</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Provide you with access to our AI-powered betting analysis</li>
            <li>Save your betting scenarios and predictions</li>
            <li>Improve our machine learning models</li>
            <li>Communicate with you about your account</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information. 
            Your data is stored securely and we do not share it with third parties except as 
            necessary to provide our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@hedgeyourbets.com
          </p>
        </div>
      </div>
    </div>
  );
}