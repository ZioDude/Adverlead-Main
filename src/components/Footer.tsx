import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-8 mt-12 shadow-inner">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">Adverlead</h3>
          <p className="text-muted-foreground">
            Streamline and optimize your Meta lead generation campaigns with Adverlead.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-muted-foreground mt-8 pt-8 border-t border-border">
        <p>&copy; {new Date().getFullYear()} Adverlead. All rights reserved.</p>
      </div>
    </footer>
  );
} 