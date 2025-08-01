import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				consciousness: ['Inter', 'sans-serif'],
				neural: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Core Design System
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Consciousness Color Palette
				void: {
					DEFAULT: 'hsl(var(--void))',
					deep: 'hsl(var(--void-deep))',
					light: 'hsl(var(--void-light))',
				},
				cosmic: {
					DEFAULT: 'hsl(var(--cosmic))',
					glow: 'hsl(var(--cosmic-glow))',
					dim: 'hsl(var(--cosmic-dim))',
					whisper: 'hsl(var(--cosmic-whisper))',
				},
				neural: {
					DEFAULT: 'hsl(var(--neural))',
					active: 'hsl(var(--neural-active))',
					dim: 'hsl(var(--neural-dim))',
				},
				consciousness: {
					primary: 'hsl(var(--consciousness-primary))',
					secondary: 'hsl(var(--consciousness-secondary))',
					whisper: 'hsl(var(--consciousness-whisper))',
				},
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					glow: 'hsl(var(--surface-glow))',
					border: 'hsl(var(--surface-border))',
				},
				
				// System Colors
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			backgroundImage: {
				'gradient-cosmic': 'var(--gradient-cosmic)',
				'gradient-void': 'var(--gradient-void)',
				'gradient-neural': 'var(--gradient-neural)',
			},
			transitionTimingFunction: {
				'silk': 'cubic-bezier(0.22, 1, 0.36, 1)',
				'neural': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			transitionDuration: {
				'silk': '600ms',
				'neural': '300ms',
			},
			boxShadow: {
				'neural': 'var(--shadow-neural)',
				'consciousness': 'var(--shadow-consciousness)',
				'void': 'var(--shadow-void)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// Neural Network Animations
				'consciousness-pulse': {
					'0%, 100%': {
						opacity: '0.6',
						transform: 'scale(1)',
						filter: 'brightness(1)',
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.02)',
						filter: 'brightness(1.2)',
					},
				},
				'neural-flow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'cosmic-glow': {
					'0%': {
						boxShadow: '0 0 20px hsl(var(--cosmic) / 0.3)',
						filter: 'brightness(1)',
					},
					'100%': {
						boxShadow: '0 0 40px hsl(var(--cosmic) / 0.6)',
						filter: 'brightness(1.3)',
					},
				},
				'thought-materialize': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.95)',
						filter: 'blur(4px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)',
						filter: 'blur(0)',
					},
				},
				'synaptic-fire': {
					'0%': {
						transform: 'scale(0.8)',
						opacity: '0',
					},
					'50%': {
						transform: 'scale(1.2)',
						opacity: '1',
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '0.8',
					},
				},
				'data-flow': {
					'0%': { backgroundPosition: '0% 0%', opacity: '0.3' },
					'50%': { backgroundPosition: '100% 100%', opacity: '0.8' },
					'100%': { backgroundPosition: '200% 200%', opacity: '0.3' },
				},
				'neural-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--cosmic) / 0.4)' },
					'50%': { boxShadow: '0 0 0 10px hsl(var(--cosmic) / 0)' },
				},
				'holographic-drift': {
					'0%': { transform: 'translate(0, 0)' },
					'100%': { transform: 'translate(60px, 60px)' },
				},
				// System Animations
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				// Consciousness Animations
				'consciousness-pulse': 'consciousness-pulse 4s ease-in-out infinite',
				'neural-flow': 'neural-flow 2s ease-in-out infinite',
				'cosmic-glow': 'cosmic-glow 1s ease-in-out infinite alternate',
				'thought-materialize': 'thought-materialize 0.6s ease-out forwards',
				'synaptic-fire': 'synaptic-fire 0.8s ease-out forwards',
				'data-flow': 'data-flow 3s ease-in-out infinite',
				'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
				'holographic-drift': 'holographic-drift 20s linear infinite',
				// System Animations
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
