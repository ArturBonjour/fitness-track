import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EyeIcon = ({ open }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {open
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364.364C20.118 15.5 16.418 18 12 18c-4.418 0-8.118-2.5-9.364-5.636a1 1 0 010-.728C3.882 8.5 7.582 6 12 6c4.418 0 8.118 2.5 9.364 5.636a1 1 0 010 .728z" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8.118-2.5-9.364-5.636a1 1 0 010-.728 10.07 10.07 0 012.063-3.369M6.53 6.53A9.956 9.956 0 0112 5c4.418 0 8.118 2.5 9.364 5.636a1 1 0 010 .728 10.03 10.03 0 01-4.364 5.195M3 3l18 18" />
        }
    </svg>
);

const getPasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const strengthLabels = ['', 'Слабый', 'Нормальный', 'Хороший', 'Отличный'];
const strengthColors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
        age: '',
        weight: '',
        height: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        if (formData.age < 15 || formData.age > 100) {
            setError('Возраст должен быть от 15 до 100 лет');
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при регистрации. Пожалуйста, попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 opacity-10 rounded-full blur-3xl" />
            </div>

            <div className="auth-card w-full max-w-lg rounded-2xl shadow-card p-8 relative animate-fade-in">
                {/* Logo & title */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-400 shadow-lg mb-3 animate-bounce-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Создать аккаунт</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bogdanov FitTrack — начни сегодня</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-5 animate-fade-in">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                            className="input-field" placeholder="Ваше имя" required autoComplete="name" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                            className="input-field" placeholder="your@email.com" required autoComplete="email" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    className="input-field pr-11" placeholder="Минимум 6 символов" minLength="6" required autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none" tabIndex={0}
                                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-1.5">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`strength-bar flex-1 ${i <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-600'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{strengthLabels[strength]}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Подтверждение</label>
                            <div className="relative">
                                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className="input-field pr-11" placeholder="Повторите пароль" minLength="6" required autoComplete="new-password" />
                                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none" tabIndex={0}
                                    aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}>
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пол</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                                className="input-field" required>
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Возраст</label>
                            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange}
                                className="input-field" placeholder="25" min="15" max="100" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Вес (кг)</label>
                            <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange}
                                className="input-field" placeholder="70" min="30" max="200" required />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Рост (см)</label>
                            <input type="number" id="height" name="height" value={formData.height} onChange={handleChange}
                                className="input-field" placeholder="175" min="100" max="250" required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-press w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-2.5 px-4 rounded-xl font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-primary dark:text-purple-400 hover:underline font-medium">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
