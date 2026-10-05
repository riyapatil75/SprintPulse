import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { loginSchema } from '../../services/authSchemas.js'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async (values) => {
    setServerError('')
    setSubmitting(true)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Could not sign in. Check your credentials and try again.'
      setServerError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      heading="Pick up where your sprint left off."
      blurb="Sign in to write your report, or to review the ones waiting on you."
    >
      <h1 className="auth__title">Sign in</h1>
      <p className="auth__sub">Use the email address your team is set up with.</p>

      {serverError && <p className="auth__server-error">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" block disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="auth__foot">
        New to SprintPulse? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  )
}