import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import './Pricing.css';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    badge: null,
    desc: 'Get started with the basics. No commitment needed.',
    color: 'default',
    features: [
      { text: 'Up to 2 resumes', ok: true },
      { text: '3 ATS-friendly templates', ok: true },
      { text: 'Manual resume builder', ok: true },
      { text: 'PDF export', ok: true },
      { text: 'AI writing features', ok: false },
      { text: 'ATS Analyser', ok: false },
      { text: 'Executive & Creative templates', ok: false },
      { text: 'Keyword optimiser', ok: false },
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$1',
    period: 'one-time · lifetime',
    badge: '⭐ Best Value',
    desc: 'All AI features unlocked, forever. Pay once, never again.',
    color: 'purple',
    features: [
      { text: 'Unlimited resumes', ok: true },
      { text: '4 professional templates', ok: true },
      { text: 'Full resume builder', ok: true },
      { text: 'PDF export', ok: true },
      { text: 'AI bullet point writer', ok: true },
      { text: 'AI summary generator', ok: true },
      { text: 'ATS Analyser (full)', ok: true },
      { text: 'Sidebar & Creative templates', ok: false },
    ],
    cta: 'Get Pro — $1 Lifetime',
    ctaStyle: 'primary',
    amount: 100, // in paise / cents
  },
  {
    id: 'max',
    name: 'Max',
    price: '$3',
    period: 'one-time · lifetime',
    badge: '👑 All Access',
    desc: 'Everything unlocked. Every template. Every AI feature. Forever.',
    color: 'gold',
    features: [
      { text: 'Unlimited resumes', ok: true },
      { text: 'All 6 premium templates', ok: true },
      { text: 'Full resume builder', ok: true },
      { text: 'PDF export', ok: true },
      { text: 'AI bullet point writer', ok: true },
      { text: 'AI summary generator', ok: true },
      { text: 'ATS Analyser (full + history)', ok: true },
      { text: 'Priority support', ok: true },
    ],
    cta: 'Get Max — $3 Lifetime',
    ctaStyle: 'gold',
    amount: 300,
  },
];

const FAQ = [
  { q: 'Is it really a one-time payment?', a: 'Yes. Pay once and own access forever. No subscriptions, no renewals, no hidden fees.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.' },
  { q: 'Can I upgrade from Pro to Max later?', a: 'Yes. Just purchase the Max plan and your account will be upgraded immediately.' },
  { q: 'Is my resume data secure?', a: 'All data is stored securely in Firebase with auth-protected access. Only you can see your resumes.' },
  { q: 'What if I need a refund?', a: 'Due to the instant digital nature of the product, we do not offer refunds. But at $1-$3, it is risk-free to try.' },
];

export default function Pricing() {
  const { user, userPlan, fetchUserPlan } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Simulate payment — replace with real Razorpay/Stripe integration
  const handlePurchase = async (plan) => {
    if (!user) { navigate('/signup'); return; }
    if (userPlan === plan.id) { showToast('You already have this plan!'); return; }
    if (plan.id === 'free') { navigate('/dashboard'); return; }

    setProcessing(plan.id);

    /* ── RAZORPAY INTEGRATION ──
    Replace this block with real Razorpay:

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: plan.amount * 100,  // in paise
      currency: 'INR',
      name: 'ResumeForge AI',
      description: `${plan.name} Plan — Lifetime Access`,
      handler: async function (response) {
        // verify payment on your backend, then update Firestore
        await updateDoc(doc(db, 'users', user.uid), { plan: plan.id });
        await fetchUserPlan(user.uid);
        showToast(`🎉 ${plan.name} plan activated! Welcome aboard.`);
        navigate('/dashboard');
      },
      prefill: { name: user.displayName, email: user.email },
      theme: { color: '#7c6aff' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();

    ── OR STRIPE ──
    const stripe = await loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
    const { error } = await stripe.redirectToCheckout({ lineItems: [...], mode: 'payment', ... });
    */

    // DEMO: Simulate successful payment after 1.5s
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), { plan: plan.id });
        await fetchUserPlan(user.uid);
        showToast(`🎉 ${plan.name} plan activated! Lifetime access unlocked.`);
        navigate('/dashboard');
      } catch (e) {
        showToast('Payment processing failed. Try again.', 'error');
      }
      setProcessing(null);
    }, 1500);
  };

  return (
    <div className="pricing-page">
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}

      <div className="pricing-hero">
        <div className="section-label">Simple Pricing</div>
        <h1>Pay once.<br /><span style={{ color: 'var(--accent2)' }}>Own it forever.</span></h1>
        <p>No subscriptions. No renewals. No tricks. Upgrade once and use ResumeForge AI for life.</p>
      </div>

      <div className="pricing-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`plan-card ${plan.color} ${userPlan === plan.id ? 'current' : ''}`}>
            {plan.badge && <div className={`plan-badge badge-${plan.color}`}>{plan.badge}</div>}
            {userPlan === plan.id && <div className="current-badge">Your Current Plan</div>}

            <div className="plan-top">
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-period">{plan.period}</div>
              <div className="plan-desc">{plan.desc}</div>
            </div>

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i} className={f.ok ? 'ok' : 'no'}>
                  <span className="feat-icon">{f.ok ? '✓' : '✗'}</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <button
              className={`btn plan-cta btn-${plan.ctaStyle}`}
              onClick={() => handlePurchase(plan)}
              disabled={processing === plan.id || userPlan === plan.id}
            >
              {processing === plan.id
                ? '⏳ Processing...'
                : userPlan === plan.id
                ? '✓ Active'
                : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="guarantee-strip">
        <div className="gs-item"><span>🔒</span><div><strong>Secure Payment</strong><p>Powered by Razorpay</p></div></div>
        <div className="gs-item"><span>♾️</span><div><strong>Lifetime Access</strong><p>Pay once, use forever</p></div></div>
        <div className="gs-item"><span>⚡</span><div><strong>Instant Activation</strong><p>Access in seconds</p></div></div>
        <div className="gs-item"><span>🤖</span><div><strong>AI Powered</strong><p>Built on Claude AI</p></div></div>
      </div>

      {/* Comparison table */}
      <div className="compare-section">
        <h2>Full Feature Comparison</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th className="th-pro">Pro <span>$1</span></th>
                <th className="th-max">Max <span>$3</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Resume limit', '2', 'Unlimited', 'Unlimited'],
                ['Templates', '3', '4', '6'],
                ['PDF export', '✓', '✓', '✓'],
                ['AI bullet writer', '✗', '✓', '✓'],
                ['AI summary writer', '✗', '✓', '✓'],
                ['ATS Analyser', '✗', '✓', '✓'],
                ['Keyword optimiser', '✗', '✓', '✓'],
                ['All 6 templates', '✗', '✗', '✓'],
                ['ATS history', '✗', '✗', '✓'],
                ['Priority support', '✗', '✗', '✓'],
              ].map(([feat, ...vals]) => (
                <tr key={feat}>
                  <td>{feat}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={v === '✓' ? 'yes' : v === '✗' ? 'no-val' : ''}>
                      {v === '✓' ? <span className="check">✓</span> : v === '✗' ? <span className="cross">✗</span> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="faq-q">
                <span>{f.q}</span>
                <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
