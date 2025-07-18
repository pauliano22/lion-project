export default function PrivacyPolicy() {
    return (
      <div className="min-h-screen bg-black text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-gold">Privacy Policy</h1>
          <p className="text-gray-300 mb-8">Last updated: January 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gold">AI Detector Chrome Extension</h2>
              <p className="text-gray-300 mb-4">
                Our AI Detector extension prioritizes user privacy and does not collect, store, or transmit any personal user data.
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 text-gold">Data Collection</h3>
              <p className="text-gray-300 mb-4">We do not collect any personal information including:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Names, email addresses, or contact information</li>
                <li>Browsing history or website activity</li>
                <li>Location data or IP addresses</li>
                <li>Audio recordings or voice data</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 text-gold">Audio Processing</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Audio is processed temporarily via Hugging Face API for AI detection</li>
                <li>No audio files are permanently stored</li>
                <li>No user identification or tracking occurs</li>
                <li>Detection history is stored locally on your device only</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 text-gold">Contact</h3>
              <p className="text-gray-300">
                If you have any questions about this privacy policy, please contact us at: [your-email@domain.com]
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }