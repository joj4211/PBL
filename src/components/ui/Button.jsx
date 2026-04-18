import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-sage-500 hover:bg-sage-600 text-white shadow-lg shadow-sage-200',
  secondary: 'bg-white/60 hover:bg-white/80 text-warm-700 border border-warm-200 shadow-sm',
  ghost: 'hover:bg-white/40 text-warm-600',
  warm: 'bg-warm-400 hover:bg-warm-500 text-white shadow-lg shadow-warm-200',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-2xl',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        font-medium transition-colors duration-200 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
