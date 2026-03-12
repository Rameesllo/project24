import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const UpdatePasswordView = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                setTimeout(() => onComplete(), 2000);
            }
        } catch (err) {
            setError('Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="view-update-password" className="view active">
            <div className="auth-page pt-safe">
                <div className="auth-box-bg"></div>

                <div className="auth-card animate-slide-up">
                    <div className="auth-icon-circle">
                        <i className="ph-fill ph-lock-key"></i>
                    </div>

                    <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: '#00332c', letterSpacing: '-0.5px' }}>Secure Access</h2>
                        <p style={{ fontWeight: 700, color: '#14b8a6', fontSize: '0.95rem' }}>Create a new password for your account</p>
                    </div>

                    <form className="auth-form" onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="input-wrapper">
                                <i className="ph-fill ph-lock input-icon"></i>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ borderRadius: '16px', paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <i className="ph-fill ph-shield-check input-icon"></i>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        {success && (
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
                                <i className="ph-fill ph-check-circle"></i>
                                Password updated successfully!
                            </div>
                        )}

                        <div className="auth-actions" style={{ marginTop: '2rem' }}>
                            <button type="submit" className="btn-v4-primary" disabled={loading || success} style={{ 
                                padding: '20px', 
                                fontSize: '1.2rem', 
                                borderRadius: '24px',
                                boxShadow: '0 8px 20px rgba(20, 184, 166, 0.2)'
                            }}>
                                {loading ? <i className="ph ph-spinner ph-spin"></i> : (
                                    <>
                                        <span>Confirm Reset</span>
                                        <i className="ph-fill ph-arrow-circle-right"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>
                    Need help? <span style={{ color: '#14b8a6' }}>Contact Support</span>
                </p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .auth-icon-circle {
                    width: 72px;
                    height: 72px;
                    background: var(--gradient-teal);
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
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.3s ease-in-out; }
            `}} />
        </div>
    );
};

export default UpdatePasswordView;
