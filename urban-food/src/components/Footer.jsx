import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#EDEDED] text-[#4A4A4A] py-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Brand Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-wide flex items-center space-x-2 font-[Poppins]">
            <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Urban Food</span>
          </h3>
          <p className="text-sm text-[#6B7280] font-[Poppins]">Fresh & yummy food delivered with love!</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-[Poppins]">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">About Us</a></li>
            <li><a href="#" className="text-sm text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">FAQs</a></li>
            <li><a href="#" className="text-sm text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">Terms</a></li>
            <li><a href="#" className="text-sm text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">Privacy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-[Poppins]">Contact Us</h3>
          <ul className="space-y-2">
            <li className="text-sm text-[#6B7280] font-[Poppins]">Email: <a href="mailto:support@urbanfood.com" className="hover:text-[#8BC34A] transition-colors duration-300">support@urbanfood.com</a></li>
            <li className="text-sm text-[#6B7280] font-[Poppins]">Phone: <a href="tel:+1234567890" className="hover:text-[#8BC34A] transition-colors duration-300">(123) 456-7890</a></li>
            <li className="text-sm text-[#6B7280] font-[Poppins]">Address: 123 Food Street</li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-[Poppins]">Stay in Touch</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-md text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
            />
            <button className="bg-[#8BC34A] text-red-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className="border-t border-[#D1D5DB] mt-6 pt-4 text-center">
        <div className="flex justify-center space-x-4 mb-3">
          <a href="#" className="text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 3.58 8.06 8.12 8.88v-6.28H7.56v-2.6h2.58v-2.02c0-2.56 1.56-3.96 3.84-3.96 1.1 0 2.04.08 2.32.12v2.7h-1.58c-1.24 0-1.48.58-1.48 1.46v1.9h2.96l-.38 2.6h-2.58v6.28c4.54-.82 8.12-4.46 8.12-8.88 0-5.52-4.48-10-10-10z"></path>
            </svg>
          </a>
          <a href="#" className="text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.96 4.84c-.88.38-1.82.64-2.82.76 1.02-.62 1.8-1.6 2.16-2.76-.96.58-2.02.98-3.14 1.2-.9-.96-2.18-1.56-3.6-1.56-2.72 0-4.92 2.2-4.92 4.92 0 .38.04.76.12 1.12-4.08-.2-7.7-2.16-10.12-5.14-.42.72-.66 1.56-.66 2.46 0 1.7.86 3.2 2.18 4.08-.8-.02-1.56-.24-2.22-.60v.06c0 2.38 1.7 4.36 3.94 4.82-.42.12-.86.18-1.32.18-.32 0-.64-.02-.94-.08.64 2 2.5 3.46 4.7 3.5-1.72 1.36-3.88 2.16-6.24 2.16-.4 0-.8-.02-1.2-.06 2.22 1.42 4.86 2.24 7.7 2.24c9.24 0 14.3-7.66 14.3-14.3 0-.22 0-.44-.02-.66.98-.72 1.84-1.62 2.52-2.64z"></path>
            </svg>
          </a>
          <a href="#" className="text-[#6B7280] hover:text-[#8BC34A] transition-colors duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-5.5 15.5v-11l9 5.5-9 5.5z"></path>
            </svg>
          </a>
        </div>
        <p className="text-sm text-[#6B7280] font-[Poppins]">© 2025 Urban Food. Made with 💚</p>
      </div>
    </footer>
  );
}

export default Footer;