import React, { useEffect, useState, useRef } from 'react';
import { type ConsciousnessNode } from '@/data/consciousness';
import { ExternalLink, Github, Globe, Mail, Phone, Linkedin } from 'lucide-react';

interface ConsciousnessPanelProps {
  node: ConsciousnessNode | null;
  onClose: () => void;
}

const ConsciousnessPanel: React.FC<ConsciousnessPanelProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (node) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [node]);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      // Add delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible, onClose]);

  if (!node) return null;

  const renderCoreContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-consciousness font-light text-consciousness-primary mb-2">
          {node.data.core}
        </h1>
        <p className="text-consciousness-secondary text-base md:text-lg font-consciousness">
          {node.data.essence}
        </p>
      </div>
      
      <div className="border-t border-surface-border pt-6">
        <h3 className="text-cosmic font-neural mb-3">Philosophy</h3>
        <p className="text-consciousness-secondary leading-relaxed font-consciousness text-sm md:text-base">
          {node.data.philosophy}
        </p>
      </div>
    </div>
  );

  const renderFoundationContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-consciousness text-consciousness-primary mb-4">
          The Foundation
        </h2>
        <div className="space-y-4 text-consciousness-secondary leading-relaxed">
          {node.data.consciousness_stream.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="font-consciousness">{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="border-t border-surface-border pt-6">
        <h3 className="text-cosmic font-neural mb-4">Core Principles</h3>
        <div className="grid gap-3">
          {node.data.key_principles.map((principle: string, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse" />
              <span className="text-consciousness-secondary font-consciousness">{principle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArchitecturesContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-consciousness text-consciousness-primary mb-4">
        The Architectures
      </h2>
      <div className="space-y-6">
        {node.data.constructs.map((project: any, i: number) => (
          <div key={i} className="holographic-surface rounded-lg p-6 border border-surface-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-consciousness text-cosmic">{project.name}</h3>
              <div className="flex gap-2">
                {project.live_consciousness && (
                  <a 
                    href={project.live_consciousness} 
                    className="text-cosmic hover:text-cosmic-glow transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {project.source_code && (
                  <a 
                    href={project.source_code}
                    className="text-cosmic hover:text-cosmic-glow transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-neural-active font-neural text-sm mb-2">Problem Space</h4>
                <p className="text-consciousness-secondary text-sm leading-relaxed">
                  {project.problem_space}
                </p>
              </div>
              
              <div>
                <h4 className="text-neural-active font-neural text-sm mb-2">Solution Matrix</h4>
                <div className="flex flex-wrap gap-2">
                  {project.solution_matrix.map((tech: string, techI: number) => (
                    <span 
                      key={techI}
                      className="px-3 py-1 bg-cosmic-whisper text-cosmic text-xs font-neural rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-neural-active font-neural text-sm mb-2">Impact Resonance</h4>
                <div className="grid gap-1">
                  {project.impact_metrics.map((metric: string, metricI: number) => (
                    <div key={metricI} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-cosmic rounded-full" />
                      <span className="text-consciousness-secondary text-sm font-consciousness">
                        {metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderToolkitContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-consciousness text-consciousness-primary mb-4">
        The Toolkit
      </h2>
      <div className="space-y-4">
        {node.data.capability_clusters.map((cluster: any, i: number) => (
          <div key={i} className="holographic-surface rounded-lg p-4 border border-surface-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-consciousness text-cosmic">{cluster.domain}</h3>
              <div className="flex items-center gap-3">
                <div className="text-xs font-neural text-consciousness-whisper">
                  {cluster.experience_years}yr experience
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-void-light rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-cosmic transition-all duration-1000"
                      style={{ width: `${cluster.mastery_level}%` }}
                    />
                  </div>
                  <span className="text-xs font-neural text-cosmic">
                    {cluster.mastery_level}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cluster.neural_networks.map((tech: string, techI: number) => (
                <span 
                  key={techI}
                  className="px-2 py-1 bg-cosmic-whisper text-cosmic text-xs font-neural rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGatewayContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-consciousness text-consciousness-primary mb-4">
        The Gateway
      </h2>
      
      <div className="space-y-4">
        <div className="holographic-surface rounded-lg p-4 border border-surface-border">
          <h3 className="text-lg font-consciousness text-cosmic mb-3">Direct Protocols</h3>
          <div className="space-y-3">
            <a 
              href={`mailto:${node.data.connection_protocols.primary}`}
              className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-neural">{node.data.connection_protocols.primary}</span>
            </a>
            {node.data.connection_protocols.secondary && (
              <a 
                href={`tel:${node.data.connection_protocols.secondary}`}
                className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-neural">{node.data.connection_protocols.secondary}</span>
              </a>
            )}
          </div>
        </div>
        
        <div className="holographic-surface rounded-lg p-4 border border-surface-border">
          <h3 className="text-lg font-consciousness text-cosmic mb-3">Network Nodes</h3>
          <div className="space-y-3">
            {node.data.connection_protocols.networks.map((network: any, i: number) => (
              <a 
                key={i}
                href={network.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors group"
              >
                {network.protocol === 'LinkedIn' && <Linkedin className="w-5 h-5" />}
                {network.protocol === 'GitHub' && <Github className="w-5 h-5" />}
                {network.protocol === 'Portfolio' && <Globe className="w-5 h-5" />}
                <div>
                  <div className="font-neural">{network.protocol}</div>
                  <div className="text-xs text-consciousness-whisper">{network.description}</div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
        
        {node.data.availability && (
          <div className="holographic-surface rounded-lg p-4 border border-surface-border">
            <h3 className="text-lg font-consciousness text-cosmic mb-3">Availability Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
                <span className="text-consciousness-secondary font-neural">
                  {node.data.availability.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <h4 className="text-neural-active font-neural text-sm mb-2">Preferences</h4>
                <div className="grid gap-1">
                  {node.data.availability.preferences.map((pref: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-cosmic rounded-full" />
                      <span className="text-consciousness-secondary text-sm">{pref}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-consciousness-whisper">
                  Location: <span className="text-consciousness-secondary">{node.data.availability.location}</span>
                </span>
                <span className="text-consciousness-whisper">
                  Level: <span className="text-consciousness-secondary">{node.data.availability.experience_level}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProjectContent = () => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-consciousness text-consciousness-primary">
          {node.data.name}
        </h2>
        <div className="flex gap-2">
          {node.data.live_consciousness && (
            <a 
              href={node.data.live_consciousness} 
              className="text-cosmic hover:text-cosmic-glow transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          {node.data.source_code && (
            <a 
              href={node.data.source_code}
              className="text-cosmic hover:text-cosmic-glow transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-neural-active font-neural mb-2">Problem Nexus</h3>
          <p className="text-consciousness-secondary leading-relaxed font-consciousness">
            {node.data.problem_space}
          </p>
        </div>
        
        <div>
          <h3 className="text-neural-active font-neural mb-2">Solution Architecture</h3>
          <div className="flex flex-wrap gap-2">
            {node.data.solution_matrix.map((tech: string, i: number) => (
              <span 
                key={i}
                className="px-3 py-1 bg-cosmic-whisper text-cosmic text-sm font-neural rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-neural-active font-neural mb-2">Impact Resonance</h3>
          <div className="grid gap-2">
            {node.data.impact_metrics.map((metric: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 holographic-surface rounded border border-surface-border">
                <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse" />
                <span className="text-consciousness-secondary font-consciousness">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (node.id) {
      case 'core':
        return renderCoreContent();
      case 'foundation':
        return renderFoundationContent();
      case 'architectures':
        return renderArchitecturesContent();
      case 'toolkit':
        return renderToolkitContent();
      case 'gateway':
        return renderGatewayContent();
      default:
        return renderProjectContent();
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isVisible && (
        <div className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40" />
      )}
      
      <div 
        ref={panelRef}
        className={`fixed ${
          isMobile 
            ? 'inset-x-4 top-16 bottom-16 max-h-[calc(100vh-8rem)]' 
            : 'inset-y-0 right-0 w-1/3 min-w-[400px] max-w-[600px]'
        } thought-bubble p-4 md:p-6 transform transition-transform duration-silk z-50 overflow-y-auto ${
          isVisible ? 'translate-x-0 translate-y-0' : (isMobile ? 'translate-y-full' : 'translate-x-full')
        }`}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
            <span className="text-consciousness-whisper font-neural text-xs md:text-sm">
              Consciousness Stream Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-consciousness-whisper hover:text-cosmic transition-colors font-neural text-lg md:text-xl p-1"
          >
            ×
          </button>
        </div>
        
        <div className="animate-thought-materialize">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default ConsciousnessPanel;