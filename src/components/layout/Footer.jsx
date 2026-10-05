import Logo from '../ui/Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo light />
        <p>Sprint reporting for engineering teams.</p>
        <p>&copy; {new Date().getFullYear()} SprintPulse</p>
      </div>
    </footer>
  )
}
