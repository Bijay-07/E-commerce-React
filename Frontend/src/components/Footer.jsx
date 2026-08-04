const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-stone-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MarkusHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;