import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Bldox Privacy Policy</title>
        <meta
          name="description"
          content="Read the privacy policy of the Bldox mobile application. Learn how we collect, use, and protect your data."
        />
      </Head>

      <article className="px-4 py-8 max-w-3xl mx-auto text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Bldox Privacy Policy
        </h1>

        <section className="space-y-4">
          <p>
            This privacy policy applies to the Bldox app (referred to as
            &quot;Application&quot;) for mobile devices that was created by
            Bldox (&quot;Service Provider&quot;) as a Free service. This service
            is provided &quot;AS IS&quot;.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            Information Collection and Use
          </h2>
          <p>
            The Application collects information when you download and use it.
            This includes:
          </p>
          <ul className="list-disc pl-5">
            <li>Your device&apos;s IP address</li>
            <li>Pages visited, time/date of visit, and time spent</li>
            <li>Operating system of your device</li>
          </ul>
          <p>
            We do not collect precise location data. Your information may be
            used to send updates, notices, and promotions. Personally
            identifiable info (like phone number and email) may be required and
            stored as per this policy.
          </p>

          <h2 className="text-xl font-semibold mt-6">Third-Party Access</h2>
          <p>
            Only anonymized, aggregated data is shared externally. Your data may
            be shared:
          </p>
          <ul className="list-disc pl-5">
            <li>As required by law</li>
            <li>To protect rights, safety, or prevent fraud</li>
            <li>
              With trusted third-party service providers (e.g. -{' '}
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Google Play Services
              </Link>
              )
            </li>
          </ul>
          <p>Each third-party service may have its own privacy policy.</p>

          <h2 className="text-xl font-semibold mt-6">Opt-Out Rights</h2>
          <p>
            You can stop all data collection by uninstalling the Application
            using your device’s standard uninstall process.
          </p>

          <h2 className="text-xl font-semibold mt-6">Data Retention Policy</h2>
          <p>
            We retain data for as long as you use the app and for a reasonable
            period afterward. To request deletion, contact us at{' '}
            <Link
              href="mailto:app.Bldox@gmail.com"
              className="text-blue-600 hover:underline"
            >
              app.Bldox@gmail.com
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold mt-6">
            Children&apos;s Privacy
          </h2>
          <p>
            The Application is not intended for children under 13. We do not
            knowingly collect data from children under this age. If such data is
            discovered, it will be promptly deleted. Contact us if you believe a
            child has provided us with data.
          </p>

          <h2 className="text-xl font-semibold mt-6">Security</h2>
          <p>
            We implement physical, electronic, and procedural safeguards to
            protect your information and ensure its confidentiality.
          </p>

          <h2 className="text-xl font-semibold mt-6">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Continued use of the
            Application after changes implies acceptance. Last updated:{' '}
            <strong>2024-10-18</strong>.
          </p>

          <h2 className="text-xl font-semibold mt-6">Your Consent</h2>
          <p>
            By using the Application, you agree to the terms outlined in this
            Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mt-6">Contact Us</h2>
          <p>
            If you have any questions or concerns, please contact us at{' '}
            <Link
              href="mailto:app.Bldox@gmail.com"
              className="text-blue-600 hover:underline"
            >
              app.Bldox@gmail.com
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  );
};

export default PrivacyPolicyPage;
