import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { signupSchema } from '../../services/authSchemas.js'

export default function Signup() {
  const { signup, user } = useAuth()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) })

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async (values) => {
    setServerError('')
    setSubmitting(true)
    try {
      // confirmPassword is never sent to the backend.
      const { confirmPassword, ...payload } = values
      await signup(payload)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      setServerError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      heading="Your sprint work, written down once."
      blurb="Create an account and start filing reports your manager can act on."
    >
      <h1 className="auth__title">Create account</h1>
      <p className="auth__sub">Takes about a minute.</p>

      {serverError && <p className="auth__server-error">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="name"
          label="Full name"
          placeholder="Aditi Rao"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="employeeId"
          label="Employee ID"
          placeholder="EMP-0042"
          autoComplete="off"
          error={errors.employeeId?.message}
          {...register('employeeId')}
        />
        <Input
          id="jobRole"
          label="Job role"
          placeholder="Software Engineer"
          autoComplete="organization-title"
          error={errors.jobRole?.message}
          {...register('jobRole')}
        />
        <Input
          id="team"
          label="Team"
          placeholder="Payments"
          autoComplete="off"
          error={errors.team?.message}
          {...register('team')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" block disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="auth__note">
        New accounts join as employees. Manager and admin access is granted by
        an administrator.
      </p>

      <p className="auth__foot">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}