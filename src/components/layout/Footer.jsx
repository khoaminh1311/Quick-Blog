import { Link } from 'react-router-dom';
import logoImg from '../quick-blog-logo.png';

export default function Footer() {
  return (
    <footer
      className="mt-0 py-20"
      style={{ backgroundColor: "oklab(0.508375 0.0304459 -0.22989 / 0.05)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[1.9fr_1fr_1fr_1fr]">
        <div>
          <img
            alt="QuickBlog"
            className="mb-6 h-12 w-auto"
            src={logoImg}
          />
          <p className="max-w-md text-base leading-7 text-slate-950 dark:text-slate-300">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde
            quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Quick Links</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Offers &amp; Deals
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Need Help?</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Delivery Information
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Return &amp; Refund Policy
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Payment Methods
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Track your Order
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                to="/"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Follow Us</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
