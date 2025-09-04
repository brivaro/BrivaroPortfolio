/* eslint-disable react/prop-types */
function Button({ href, children }) {
  return (
    <a
      className="dark:focus:ring-offset-white-800/75 flex items-center gap-2 rounded-full border border-cyan bg-gray4 px-4 py-1 font-medium text-cyan outline-none transition-all duration-300 hover:bg-cyan hover:text-white focus:ring-2 focus:ring-offset-2 dark:hover:bg-cyan dark:hover:text-white "
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default Button;
