// Brand Configuration - Control AI
export const brand = {
  name: 'Control AI',
  tagline: 'Seu Assistente Inteligente de Negócios',

  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Accent color
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    success: {
      light: '#bbf7d0',
      DEFAULT: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      light: '#fde68a',
      DEFAULT: '#f59e0b',
      dark: '#b45309',
    },
    danger: {
      light: '#fecaca',
      DEFAULT: '#ef4444',
      dark: '#b91c1c',
    },
  },

  gradients: {
    primary: 'from-blue-600 to-blue-700',
    accent: 'from-purple-600 to-purple-700',
    success: 'from-green-600 to-green-700',
    hero: 'from-blue-600 via-purple-600 to-indigo-700',
    subtle: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    brand: '0 10px 40px -10px rgba(59, 130, 246, 0.4)',
  },

  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
}

export const roleColors = {
  master: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-700',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  admin_tenant: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  colaborador: {
    bg: 'bg-gray-100 dark:bg-gray-700/30',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-300 dark:border-gray-600',
    icon: 'text-gray-600 dark:text-gray-400',
  },
}

export const statusColors = {
  active: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
    dot: 'bg-green-500',
  },
  inactive: {
    bg: 'bg-gray-100 dark:bg-gray-700/30',
    text: 'text-gray-800 dark:text-gray-200',
    dot: 'bg-gray-500',
  },
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-200',
    dot: 'bg-yellow-500',
  },
}
