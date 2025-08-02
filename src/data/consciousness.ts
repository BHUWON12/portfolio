// The Digital Consciousness - Bhuwan Singh's Neural Data Architecture
// Version 2.3 - Live Project Links Integrated

export interface ConsciousnessNode {
  id: string;
  title: string;
  position: { x: number; y: number };
  type: 'core' | 'primary' | 'secondary';
  connections: string[];
  data?: any;
}

export interface NeuralPathway {
  id:string;
  from: string;
  to: string;
  type: 'primary' | 'secondary' | 'tertiary';
  animated?: boolean;
}

export interface Project {
  id: string;
  name: string;
  problem_space: string;
  solution_matrix: string[];
  live_consciousness?: string;
  source_code?: string;
  system_visualization?: string;
  impact_metrics: string[];
  neural_complexity: 'simple' | 'complex' | 'transcendent';
}

export interface CapabilityCluster {
  domain: string;
  neural_networks: string[];
  mastery_level: number; // 0-100
  experience_years: number;
}

export const consciousnessData = {
  consciousness: {
    core: "Bhuwan Singh",
    essence: "Specialist in AI-Powered Backend Systems | Architecting the Future with FastAPI & Machine Learning",
    tagline: "Building Intelligent Backends",
    philosophy: "My focus is at the intersection of high-performance backend engineering and artificial intelligence. I build systems with FastAPI that are not just fast and scalable, but also intelligent, capable of learning and adapting to drive real-world impact."
  },
  
  neural_pathways: {
    foundation: {
      title: "The Foundation",
      consciousness_stream: `I am dedicating my career to mastering the art of building intelligent backend systems. My primary focus is on leveraging FastAPI for its speed and modern architecture to create powerful APIs and services.

Simultaneously, I am diving deep into Machine Learning to integrate predictive and analytical capabilities directly into the applications I build. My goal is to bridge the gap between raw data and intelligent action, creating software that is not only functional but insightful.`,
      key_principles: [
        "AI-first system design",
        "High-performance API development with FastAPI", 
        "Scalable machine learning model deployment",
        "Data-centric and resilient architecture"
      ]
    },
    
    architectures: {
      title: "The Architectures",
      constructs: [
        {
          id: "guffgaaf-chat",
          name: "GuffGaaf - Anonymous Chat",
          problem_space: "Creating a real-time, anonymous chat platform requires a high-performance backend capable of handling persistent connections and a fast, responsive frontend for a seamless user experience. The challenge lies in efficient user matchmaking and state management.",
          solution_matrix: ["FastAPI", "WebSockets", "Redis", "React", "TypeScript", "Tailwind CSS", "Docker"],
          live_consciousness: "https://guff-gaaf.vercel.app/",
          source_code: "",
          system_visualization: "",
          impact_metrics: [
            "Real-time messaging with WebSockets",
            "Scalable matchmaking logic using Redis",
            "High-performance FastAPI backend",
            "Containerized for easy deployment"
          ],
          neural_complexity: "transcendent"
        },
        {
          id: "activevacancy-jobs",
          name: "activevacancy - Job Portal",
          problem_space: "Job seekers need a streamlined application process without mandatory registration, while employers require a powerful admin panel to manage applications efficiently. The platform needed to be fast, SEO-optimized, and monetizable.",
          solution_matrix: ["React", "TypeScript", "Tailwind CSS", "React Router DOM", "React Hook Form", "Vite"],
          live_consciousness: "https://active-vacancy-frontend.vercel.app/",
          source_code: "",
          system_visualization: "",
          impact_metrics: [
            "Streamlined applications without user registration",
            "Advanced job filtering and search",
            "Secure admin panel with Excel export & CV management",
            "SEO optimized and Google AdSense ready"
          ],
          neural_complexity: "transcendent"
        },
        {
          id: "vastrimo-ecommerce",
          name: "Vastrimo E-commerce",
          problem_space: "Standard e-commerce platforms can lack a modern, responsive, and high-quality user experience. The goal was to build a private, seamless shopping frontend with robust navigation, authentication, and product discovery features.",
          solution_matrix: ["React", "TypeScript", "Tailwind CSS", "React Router", "Lucide-react"],
          live_consciousness: "https://www.vastrimo.com/",
          source_code: "",
          system_visualization: "",
          impact_metrics: [
            "Designed for a premium, private user experience",
            "Fully responsive design for all devices",
            "Secure authentication and admin controls",
            "Optimized UI with modern aesthetics"
          ],
          neural_complexity: "complex"
        },
        {
          id: "agridoc-ml",
          name: "AgriDoctor - Plant Disease Detection",
          problem_space: "Farmers and gardeners often struggle to identify plant diseases quickly and accurately, leading to crop loss. The challenge was to create an accessible tool that could diagnose plant diseases from an image and provide immediate, actionable advice.",
          solution_matrix: ["FastAPI", "Streamlit", "TensorFlow", "Keras", "OpenCV", "Python"],
          live_consciousness: "https://agridoctor.streamlit.app/",
          source_code: "",
          system_visualization: "",
          impact_metrics: [
            "AI-powered disease detection from images",
            "Provides detailed treatment and prevention info",
            "User-friendly interface for quick analysis",
            "Reduces reliance on manual expert diagnosis"
          ],
          neural_complexity: "complex"
        },
        {
          id: "clearair-vision-ml",
          name: "Clear Air Vision UI",
          problem_space: "Air quality data is often complex and difficult for the public to understand. The goal was to create a user-friendly interface to an AI model that could predict air quality, analyze historical data, and make the information accessible and actionable.",
          solution_matrix: ["Streamlit", "FastAPI", "Python", "Plotly", "Pandas", "HTML/CSS"],
          live_consciousness: "https://clearairvision.streamlit.app/",
          source_code: "",
          system_visualization: "",
          impact_metrics: [
            "Predicts air quality with user input",
            "Visualizes historical data trends",
            "Evaluates and displays model performance",
            "Makes complex AI data understandable"
          ],
          neural_complexity: "complex"
        }
      ]
    },
    
    toolkit: {
      title: "The Toolkit",
      capability_clusters: [
        {
          domain: "Backend Consciousness",
          neural_networks: ["Python", "FastAPI", "WebSockets", "REST APIs", "SQLAlchemy", "Asyncio"],
          mastery_level: 81,
          experience_years: 1
        },
        {
          domain: "AI Cognition",
          neural_networks: ["TensorFlow", "PyTorch", "Keras", "OpenCV", "Pandas", "Scikit-learn", "MLOps"],
          mastery_level: 58,
          experience_years: 1
        },
        {
          domain: "Data Synapses",
          neural_networks: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Vector Databases"],
          mastery_level: 70,
          experience_years: 1
        },
        {
          domain: "Cloud Neurons",
          neural_networks: ["Docker", "Git", "GitHub", "Linux", "AWS (S3, EC2, SageMaker)", "CI/CD"],
          mastery_level: 55,
          experience_years: 1
        },
        {
            domain: "Frontend Cortex",
            neural_networks: ["React", "TypeScript", "Streamlit", "HTML/CSS"],
            mastery_level: 30,
            experience_years: 1
        }
      ]
    },
    
    gateway: {
      title: "The Gateway",
      connection_protocols: {
        primary: "bhandaribh12@gmail.com",
        secondary: "+918431581667",
        networks: [
          {
            protocol: "LinkedIn",
            endpoint: "https://www.linkedin.com/in/bhuwansingh02/",
            description: "Professional network"
          },
          {
            protocol: "GitHub", 
            endpoint: "https://github.com/BHUWON12",
            description: "Code repository"
          }
        ]
      },
      availability: {
        status: "SEEKING_SPECIALIZED_ROLES",
        preferences: [
          "FastAPI Backend Engineer",
          "Machine Learning Engineer", 
          "AI-Powered Application Developer",
          "Python Backend Developer (AI Focus)"
        ],
        location: "Remote / India",
        experience_level: "MID (1 years)"
      }
    }
  }
};

// Neural Network Graph Data
export const neuralNodes: ConsciousnessNode[] = [
  // Core Consciousness
  {
    id: "core",
    title: "Bhuwan Singh",
    position: { x: 0, y: 0 },
    type: "core",
    connections: ["foundation", "architectures", "toolkit", "gateway"],
    data: consciousnessData.consciousness
  },
  
  // Primary Nodes
  {
    id: "foundation",
    title: "Foundation",
    position: { x: -300, y: -200 },
    type: "primary",
    connections: ["core"],
    data: consciousnessData.neural_pathways.foundation
  },
  {
    id: "architectures",
    title: "Projects", 
    position: { x: 300, y: 0 },
    type: "primary",
    connections: ["core", "guffgaaf-chat", "activevacancy-jobs", "vastrimo-ecommerce", "agridoc-ml", "clearair-vision-ml"],
    data: consciousnessData.neural_pathways.architectures
  },
  {
    id: "toolkit",
    title: "Toolkit",
    position: { x: 300, y: 400 },
    type: "primary", 
    connections: ["core"],
    data: consciousnessData.neural_pathways.toolkit
  },
  {
    id: "gateway",
    title: "Gateway",
    position: { x: -300, y: 200 },
    type: "primary",
    connections: ["core"],
    data: consciousnessData.neural_pathways.gateway
  },
  
  // Secondary Nodes (Projects)
  {
    id: "guffgaaf-chat",
    title: "GuffGaaf",
    position: { x: 600, y: -250 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[0]
  },
  {
    id: "activevacancy-jobs", 
    title: "activevacancy",
    position: { x: 650, y: -100 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[1]
  },
  {
    id: "vastrimo-ecommerce",
    title: "Vastrimo",
    position: { x: 650, y: 50 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[2]
  },
  {
    id: "agridoc-ml",
    title: "AgriDoctor",
    position: { x: 600, y: 200 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[3]
  },
  {
    id: "clearair-vision-ml",
    title: "Clear Air Vision",
    position: { x: 550, y: 350 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[4]
  }
];

export const neuralPathways: NeuralPathway[] = [
  // Core to Primary connections
  { id: "core-foundation", from: "core", to: "foundation", type: "primary", animated: true },
  { id: "core-architectures", from: "core", to: "architectures", type: "primary", animated: true },
  { id: "core-toolkit", from: "core", to: "toolkit", type: "primary", animated: true },
  { id: "core-gateway", from: "core", to: "gateway", type: "primary", animated: true },
  
  // Architectures to Projects
  { id: "arch-guffgaaf", from: "architectures", to: "guffgaaf-chat", type: "secondary" },
  { id: "arch-activevacancy", from: "architectures", to: "activevacancy-jobs", type: "secondary" },
  { id: "arch-vastrimo", from: "architectures", to: "vastrimo-ecommerce", type: "secondary" },
  { id: "arch-agridoc", from: "architectures", to: "agridoc-ml", type: "secondary" },
  { id: "arch-clearair", from: "architectures", to: "clearair-vision-ml", type: "secondary" }
];
