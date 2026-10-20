import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthService, UserService, setApiToken, registerUnauthorizedHandler } from '../services/api';

vi.mock('../services/api', () => {
  let inMemoryToken = null;
  let unauthorizedHandler = null;

  return {
    AuthService: {
      login: vi.fn(),
      register: vi.fn()
    },
    UserService: {
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn()
    },
    setApiToken: vi.fn((token) => {
      inMemoryToken = token;
    }),
    getApiToken: vi.fn(() => inMemoryToken),
    registerUnauthorizedHandler: vi.fn((cb) => {
      unauthorizedHandler = cb;
    }),
    triggerUnauthorized: () => {
      if (unauthorizedHandler) unauthorizedHandler();
    }
  };
});

const renderWithProviders = (ui, { initialEntries = ['/'] } = {}) => {
  return render(
    <ToastProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          {ui}
        </MemoryRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

describe('Frontend Authentication Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Login validation displays field errors when submitted empty', async () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('Registration validation displays errors for invalid fields and mismatched passwords', async () => {
    const { container } = renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });

    const nameInput = container.querySelector('#register-name');
    const emailInput = container.querySelector('#register-email');
    const passwordInput = container.querySelector('#register-password');
    const confirmPasswordInput = container.querySelector('#register-confirm-password');
    const submitBtn = screen.getByRole('button', { name: /register account/i });

    // 1. Submit with empty inputs
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/^password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });

    // 2. Submit with mismatched passwords and short password
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Alice' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'alice@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'different' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('Login displays server error message when authentication fails', async () => {
    AuthService.login.mockRejectedValueOnce(new Error('Invalid email or password'));

    const { container } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    fireEvent.change(container.querySelector('#login-email'), { target: { name: 'email', value: 'user@example.com' } });
    fireEvent.change(container.querySelector('#login-password'), { target: { name: 'password', value: 'WrongPass@123' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('Protected route redirects unauthenticated user to /login', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page Screen</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] }
    );

    // Should redirect to login screen, not render secret dashboard
    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('Successful login stores token in memory and navigates to protected content', async () => {
    AuthService.login.mockResolvedValueOnce({
      token: 'jwt-mock-token-xyz',
      tokenType: 'Bearer',
      user: { id: 1, name: 'Alice Test', email: 'alice@test.com', role: 'USER' }
    });

    const { container } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Welcome to Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/login'] }
    );

    fireEvent.change(container.querySelector('#login-email'), { target: { name: 'email', value: 'alice@test.com' } });
    fireEvent.change(container.querySelector('#login-password'), { target: { name: 'password', value: 'Password@123' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'alice@test.com',
        password: 'Password@123'
      });
      expect(screen.getByText('Welcome to Protected Dashboard')).toBeInTheDocument();
    });
  });

  it('Logout clears user and token from memory', async () => {
    AuthService.login.mockResolvedValueOnce({
      token: 'valid-jwt-token',
      tokenType: 'Bearer',
      user: { id: 1, name: 'Bob Tester', email: 'bob@test.com', role: 'USER' }
    });

    const TestLogoutConsumer = () => {
      const { user, isAuthenticated, login, logout } = useAuth();
      return (
        <div>
          <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
          {user && <div data-testid="user-name">{user.name}</div>}
          <button onClick={() => login({ email: 'bob@test.com', password: 'Password@123' })}>Do Login</button>
          <button onClick={logout}>Sign Out Button</button>
        </div>
      );
    };

    renderWithProviders(<TestLogoutConsumer />);

    // 1. Log in
    fireEvent.click(screen.getByText('Do Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Bob Tester');
    });

    // 2. Click Logout
    fireEvent.click(screen.getByText('Sign Out Button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
      expect(setApiToken).toHaveBeenCalledWith(null);
    });
  });

  it('Expired-token triggers unauthorized handler and logs out user', async () => {
    const { triggerUnauthorized } = await import('../services/api');

    AuthService.login.mockResolvedValueOnce({
      token: 'expired-soon-token',
      tokenType: 'Bearer',
      user: { id: 1, name: 'Carol Expired', email: 'carol@test.com', role: 'USER' }
    });

    const TestExpiredConsumer = () => {
      const { isAuthenticated, login } = useAuth();
      return (
        <div>
          <div data-testid="status">{isAuthenticated ? 'ACTIVE' : 'EXPIRED_LOGGED_OUT'}</div>
          <button onClick={() => login({ email: 'carol@test.com', password: 'Password@123' })}>Login Carol</button>
        </div>
      );
    };

    renderWithProviders(<TestExpiredConsumer />);

    // Login first
    fireEvent.click(screen.getByText('Login Carol'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('ACTIVE');
    });

    // Simulate 401 response from backend
    triggerUnauthorized();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('EXPIRED_LOGGED_OUT');
    });
  });
});
