import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { socials } from '@/data/socials';

export function Contact() {
  return <section id="contact" className="contact-reset"><div className="reset-section">
    <div className="section-meta"><span><i className="status-dot" /> Say hi / Let's talk</span><span>Xiamen / Remote</span></div>
    <div className="contact-title"><h2>Want to build<br />something<br /><span>together?</span></h2><a className="contact-orb" href="mailto:l1fuyue@icloud.com" aria-label="发送邮件给李富悦"><span>Get in touch</span><span><SymbolIcon name="arrow-up-right" /></span></a></div>
    <div className="contact-bottom"><p>不管是正经项目还是有意思的实验，都欢迎找我聊——不写代码的时候大概在跑马或者健身。邮件、Twitter 私信都行。</p><div>{socials.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className="text-link">{social.label} <SymbolIcon name="arrow-up-right" /></a>)}</div></div>
  </div></section>;
}
