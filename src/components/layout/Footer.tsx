import { Link } from 'react-router-dom';

export function Footer() {
  return <footer className="reset-footer"><Link to="/" className="footer-signature">Lifuyue <span>✳</span></Link><p>全栈开发、AI Agent 工作流，<br />以及从想法到交付的记录。</p><div><span>© {new Date().getFullYear()}</span><Link to="#main-content" className="text-link">Back to top ↑</Link></div></footer>;
}
