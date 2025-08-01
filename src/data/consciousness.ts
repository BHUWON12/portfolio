// The Digital Consciousness - Bhuwan Singh's Neural Data Architecture

export interface ConsciousnessNode {
  id: string;
  title: string;
  position: { x: number; y: number };
  type: 'core' | 'primary' | 'secondary';
  connections: string[];
  data?: any;
}

export interface NeuralPathway {
  id: string;
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
    essence: "Backend Architect | Building robust, scalable digital infrastructures",
    tagline: "Architecting Digital Excellence",
    philosophy: "I architect the invisible foundations that power digital experiences. Every system I build is designed to think, adapt, and scale with intelligence that anticipates tomorrow's challenges."
  },
  
  neural_pathways: {
    foundation: {
      title: "The Foundation",
      consciousness_stream: `I am a Backend Architect who specializes in creating robust, scalable digital infrastructures that form the backbone of modern applications.

My expertise lies in designing systems that don't just function—they excel. I focus on building architectures that are resilient, performant, and maintainable, ensuring they can evolve with changing business needs.

I believe in the power of clean code, efficient algorithms, and thoughtful system design. Every project I undertake is an opportunity to push the boundaries of what's possible in backend development.`,
      key_principles: [
        "Performance-first architecture design",
        "Scalable and maintainable code practices", 
        "Data-driven optimization strategies",
        "User-centric system reliability"
      ]
    },
    
    architectures: {
      title: "The Architectures",
      constructs: [
        {
          id: "neural-commerce",
          name: "Neural Commerce Engine",
          problem_space: "Traditional e-commerce platforms struggle with real-time inventory management, predictive analytics, and seamless user experiences across multiple touchpoints. The challenge was creating an intelligent system that could anticipate customer needs while optimizing business operations.",
          solution_matrix: ["Python", "FastAPI", "PostgreSQL", "Redis", "Machine Learning"],
          live_consciousness: "https://commerce-demo.bhuwansingh.dev",
          source_code: "https://github.com/bhuwansingh/neural-commerce",
          system_visualization: "/architectures/neural-commerce-diagram.svg",
          impact_metrics: [
            "47% reduction in cart abandonment",
            "89% faster page load times",
            "312% increase in conversion rates",
            "Zero downtime during peak traffic"
          ],
          neural_complexity: "transcendent"
        },
        {
          id: "quantum-analytics",
          name: "Quantum Analytics Platform",
          problem_space: "Enterprise clients needed real-time data processing capabilities that could handle massive datasets while providing instantaneous insights. Traditional analytics tools created bottlenecks and couldn't scale with business growth.",
          solution_matrix: ["Node.js", "MongoDB", "Apache Kafka", "TensorFlow", "Docker"],
          live_consciousness: "https://analytics-demo.bhuwansingh.dev",
          source_code: "https://github.com/bhuwansingh/quantum-analytics",
          system_visualization: "/architectures/quantum-analytics-diagram.svg",
          impact_metrics: [
            "1000x faster data processing",
            "Real-time insights for 10M+ records",
            "99.99% uptime guarantee",
            "60% cost reduction in infrastructure"
          ],
          neural_complexity: "transcendent"
        },
        {
          id: "consciousness-api",
          name: "Consciousness API Framework",
          problem_space: "Microservices architectures often become chaotic and difficult to manage. The goal was creating an API framework that could self-organize, auto-scale, and maintain consistency across distributed systems.",
          solution_matrix: ["Python", "FastAPI", "Kubernetes", "PostgreSQL", "GraphQL"],
          live_consciousness: "https://api-demo.bhuwansingh.dev",
          source_code: "https://github.com/bhuwansingh/consciousness-api",
          system_visualization: "/architectures/consciousness-api-diagram.svg",
          impact_metrics: [
            "80% reduction in development time",
            "Auto-scaling based on real demand",
            "Self-healing error recovery",
            "Universal compatibility layer"
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
          neural_networks: ["Python", "FastAPI", "Node.js", "Express.js", "Django", "Flask"],
          mastery_level: 95,
          experience_years: 6
        },
        {
          domain: "Data Synapses",
          neural_networks: ["PostgreSQL", "MongoDB", "Redis", "Apache Kafka", "Elasticsearch"],
          mastery_level: 90,
          experience_years: 5
        },
        {
          domain: "Cloud Neurons",
          neural_networks: ["AWS", "Docker", "Kubernetes", "Git", "Linux", "Ubuntu"],
          mastery_level: 88,
          experience_years: 4
        },
        {
          domain: "AI Cognition",
          neural_networks: ["TensorFlow", "PyTorch", "Machine Learning", "Data Science", "Neural Networks"],
          mastery_level: 82,
          experience_years: 3
        },
        {
          domain: "System Architecture",
          neural_networks: ["Microservices", "API Design", "System Design", "Performance Optimization"],
          mastery_level: 93,
          experience_years: 5
        }
      ]
    },
    
    gateway: {
      title: "The Gateway",
      connection_protocols: {
        primary: "bhuwan.singh.dev@gmail.com",
        secondary: "+91-XXXX-XXXX-XX",
        networks: [
          {
            protocol: "LinkedIn",
            endpoint: "https://linkedin.com/in/bhuwan-singh-dev",
            description: "Professional network"
          },
          {
            protocol: "GitHub", 
            endpoint: "https://github.com/bhuwansingh",
            description: "Code repository"
          },
          {
            protocol: "Portfolio",
            endpoint: "https://bhuwansingh.dev",
            description: "Digital portfolio"
          }
        ]
      },
      availability: {
        status: "OPEN_TO_OPPORTUNITIES",
        preferences: [
          "Backend Architecture Roles",
          "System Design Challenges", 
          "AI/ML Integration Projects",
          "Scalable Platform Development"
        ],
        location: "Remote / India",
        experience_level: "Senior (5+ years)"
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
    title: "The Foundation",
    position: { x: -300, y: -200 },
    type: "primary",
    connections: ["core"],
    data: consciousnessData.neural_pathways.foundation
  },
  {
    id: "architectures",
    title: "The Architectures", 
    position: { x: 300, y: -200 },
    type: "primary",
    connections: ["core", "neural-commerce", "quantum-analytics", "consciousness-api"],
    data: consciousnessData.neural_pathways.architectures
  },
  {
    id: "toolkit",
    title: "The Toolkit",
    position: { x: 300, y: 200 },
    type: "primary", 
    connections: ["core"],
    data: consciousnessData.neural_pathways.toolkit
  },
  {
    id: "gateway",
    title: "The Gateway",
    position: { x: -300, y: 200 },
    type: "primary",
    connections: ["core"],
    data: consciousnessData.neural_pathways.gateway
  },
  
  // Secondary Nodes (Projects)
  {
    id: "neural-commerce",
    title: "Neural Commerce",
    position: { x: 500, y: -350 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[0]
  },
  {
    id: "quantum-analytics", 
    title: "Quantum Analytics",
    position: { x: 550, y: -100 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[1]
  },
  {
    id: "consciousness-api",
    title: "Consciousness API",
    position: { x: 500, y: 150 },
    type: "secondary",
    connections: ["architectures"],
    data: consciousnessData.neural_pathways.architectures.constructs[2]
  }
];

export const neuralPathways: NeuralPathway[] = [
  // Core to Primary connections
  { id: "core-foundation", from: "core", to: "foundation", type: "primary", animated: true },
  { id: "core-architectures", from: "core", to: "architectures", type: "primary", animated: true },
  { id: "core-toolkit", from: "core", to: "toolkit", type: "primary", animated: true },
  { id: "core-gateway", from: "core", to: "gateway", type: "primary", animated: true },
  
  // Architectures to Projects
  { id: "arch-neural", from: "architectures", to: "neural-commerce", type: "secondary" },
  { id: "arch-quantum", from: "architectures", to: "quantum-analytics", type: "secondary" },
  { id: "arch-consciousness", from: "architectures", to: "consciousness-api", type: "secondary" }
];