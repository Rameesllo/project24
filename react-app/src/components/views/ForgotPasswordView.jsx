import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const ForgotPasswordView = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const emailAlias = email.includes('@') ? email : `${email}@nextstop.com`;

            // Use origin for reliability
            const origin = window.location.origin;
            console.log('Reset password request for:', emailAlias);
            console.log('Redirecting to origin:', origin);

            if (origin.includes('localhost')) {
                console.warn("⚠️ Warning: Requesting reset from 'localhost'. This link will NOT work on mobile devices.");
            }

            const { error } = await supabase.auth.resetPasswordForEmail(emailAlias, {
                redirectTo: origin,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage('Recovery link sent! Check your inbox.');
            }
        } catch (err) {
            setError('Could not connect to service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="view-forgot-password" className="view active">
            <div className="auth-page pt-safe">
                <div className="auth-box-bg"></div>

                <button className="btn-icon btn-outline auth-back-btn" onClick={onBack} style={{ top: '20px', left: '20px' }}>
                    <i className="ph ph-arrow-left"></i>
                </button>

                <div className="auth-card animate-slide-up">
                    <div className="auth-icon-circle" style={{ background: 'var(--gradient-teal)' }}>
                        <i className="ph-fill ph-keyhole"></i>
                    </div>

                    <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: '#00332c', letterSpacing: '-0.5px' }}>Account Recovery</h2>
                        <p style={{ fontWeight: 700, color: '#14b8a6', fontSize: '0.95rem' }}>We'll send a secure link to your verified email</p>
                    </div>

                    <form className="auth-form" onSubmit={handleReset}>
                        <div className="form-group">
                            <label className="form-label">Registered Email</label>
                            <div className="input-wrapper">
                                <i className="ph-fill ph-envelope-simple-open input-icon"></i>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="your-email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ borderRadius: '16px', paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-badge animate-shake" style={{ 
                                background: '#fef2f2', 
                                color: '#ef4444', 
                                padding: '12px', 
                                borderRadius: '16px', 
                                border: '1px solid #fee2e2',
                                marginBottom: '1.5rem', 
                                textAlign: 'center', 
                                fontSize: '0.85rem', 
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <i className="ph-fill ph-warning-circle"></i>
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="success-badge animate-bounce-in" style={{ 
                                background: '#f0fdfa', 
                                color: '#0d9488', 
                                padding: '16px', 
                                borderRadius: '16px', 
                                border: '1px solid #ccfbf1',
                                marginBottom: '1.5rem', 
                                textAlign: 'center', 
                                fontSize: '0.9rem', 
                                fontWeight: 900,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                <i className="ph-fill ph-paper-plane-tilt"></i>
                                {message}
                            </div>
                        )}

                        <div className="auth-actions" style={{ marginTop: '2rem' }}>
                            <button type="submit" className="btn-v4-primary" disabled={loading} style={{ 
                                padding: '20px', 
                                fontSize: '1.2rem', 
                                borderRadius: '24px',
                                boxShadow: '0 8px 20px rgba(20, 184, 166, 0.2)'
                            }}>
                                {loading ? <i className="ph ph-spinner ph-spin"></i> : (
                                    <>
                                        <span>Send Recovery Link</span>
                                        <i className="ph-fill ph-check-circle"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>
                        Remember your password? 
                        <span onClick={onBack} style={{ color: '#14b8a6', marginLeft: '5px', cursor: 'pointer', textDecoration: 'underline' }}>Sign In</span>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .auth-icon-circle {
                    width: 72px;
                    height: 72px;
                    border-radius: 24px;
                    margin: -60px auto 24px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: white;
                    box-shadow: 0 12px 24px rgba(20, 184, 166, 0.3);
                    border: 4px solid white;
                }
                .input-wrapper .input-icon {
                    color: #14b8a6;
                    font-size: 1.25rem;
                }
                .form-input:focus {
                    border-color: #14b8a6;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
                }
            `}} />
        </div>
    );
};

export default ForgotPasswordView;
