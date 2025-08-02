import React, { useEffect, useState, useRef } from 'react';
import { type ConsciousnessNode } from '@/data/consciousness';
import { ExternalLink, Github, Globe, Mail, Phone, Linkedin, X } from 'lucide-react';

interface ConsciousnessPanelProps {
  node: ConsciousnessNode | null;
  onClose: () => void;
}

const ConsciousnessPanel: React.FC<ConsciousnessPanelProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Enhanced responsive detection
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // sm breakpoint
      setIsTablet(width >= 640 && width < 1024); // between sm and lg
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
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

    if (isVisible && !isMobile) {
      // Only enable click outside on desktop
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible, onClose, isMobile]);

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (isMobile && isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isVisible]);

  if (!node) return null;

  const renderCoreContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-consciousness font-light text-consciousness-primary mb-2 sm:mb-3 leading-tight">
          {node.data.core}
        </h1>
        <p className="text-consciousness-secondary text-sm sm:text-base lg:text-lg font-consciousness leading-relaxed">
          {node.data.essence}
        </p>
      </div>
      
      <div className="border-t border-surface-border pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg text-cosmic font-neural mb-2 sm:mb-3">Philosophy</h3>
        <p className="text-consciousness-secondary leading-relaxed font-consciousness text-sm sm:text-base">
          {node.data.philosophy}
        </p>
      </div>
    </div>
  );

  const renderFoundationContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-consciousness text-consciousness-primary mb-3 sm:mb-4">
          The Foundation
        </h2>
        <div className="space-y-3 sm:space-y-4 text-consciousness-secondary leading-relaxed">
          {node.data.consciousness_stream.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="font-consciousness text-sm sm:text-base">{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="border-t border-surface-border pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg text-cosmic font-neural mb-3 sm:mb-4">Core Principles</h3>
        <div className="grid gap-2 sm:gap-3">
          {node.data.key_principles.map((principle: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-2 sm:p-3 rounded-lg hover:bg-cosmic-whisper/5 transition-colors">
              <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse mt-2 flex-shrink-0" />
              <span className="text-consciousness-secondary font-consciousness text-sm sm:text-base">{principle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArchitecturesContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-consciousness text-consciousness-primary mb-3 sm:mb-4">
        The Architectures
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {node.data.constructs.map((project: any, i: number) => (
          <div key={i} className="holographic-surface rounded-lg p-4 sm:p-6 border border-surface-border hover:border-cosmic/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <h3 className="text-lg sm:text-xl font-consciousness text-cosmic leading-tight">{project.name}</h3>
              <div className="flex gap-2 flex-shrink-0">
                {project.live_consciousness && (
                  <a 
                    href={project.live_consciousness} 
                    className="text-cosmic hover:text-cosmic-glow transition-colors p-1 rounded hover:bg-cosmic-whisper/10"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="View live project"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {project.source_code && (
                  <a 
                    href={project.source_code}
                    className="text-cosmic hover:text-cosmic-glow transition-colors p-1 rounded hover:bg-cosmic-whisper/10"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="View source code"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="text-neural-active font-neural text-xs sm:text-sm mb-2">Problem Space</h4>
                <p className="text-consciousness-secondary text-sm sm:text-base leading-relaxed">
                  {project.problem_space}
                </p>
              </div>
              
              <div>
                <h4 className="text-neural-active font-neural text-xs sm:text-sm mb-2">Solution Matrix</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.solution_matrix.map((tech: string, techI: number) => (
                    <span 
                      key={techI}
                      className="px-2 sm:px-3 py-1 bg-cosmic-whisper text-cosmic text-xs sm:text-sm font-neural rounded-full hover:bg-cosmic-whisper/80 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-neural-active font-neural text-xs sm:text-sm mb-2">Impact Resonance</h4>
                <div className="grid gap-1.5 sm:gap-2">
                  {project.impact_metrics.map((metric: string, metricI: number) => (
                    <div key={metricI} className="flex items-start gap-2 sm:gap-3 p-2 rounded hover:bg-cosmic-whisper/5 transition-colors">
                      <div className="w-1 h-1 bg-cosmic rounded-full mt-2 flex-shrink-0" />
                      <span className="text-consciousness-secondary text-xs sm:text-sm font-consciousness leading-relaxed">
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
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-consciousness text-consciousness-primary mb-3 sm:mb-4">
        The Toolkit
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {node.data.capability_clusters.map((cluster: any, i: number) => (
          <div key={i} className="holographic-surface rounded-lg p-3 sm:p-4 border border-surface-border hover:border-cosmic/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-consciousness text-cosmic">{cluster.domain}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="text-xs font-neural text-consciousness-whisper">
                  {cluster.experience_years}yr experience
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-void-light rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-cosmic transition-all duration-1000"
                      style={{ width: `${cluster.mastery_level}%` }}
                    />
                  </div>
                  <span className="text-xs font-neural text-cosmic min-w-[2rem] text-right">
                    {cluster.mastery_level}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {cluster.neural_networks.map((tech: string, techI: number) => (
                <span 
                  key={techI}
                  className="px-2 py-1 bg-cosmic-whisper text-cosmic text-xs font-neural rounded hover:bg-cosmic-whisper/80 transition-colors"
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
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-consciousness text-consciousness-primary mb-3 sm:mb-4">
        The Gateway
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="holographic-surface rounded-lg p-3 sm:p-4 border border-surface-border hover:border-cosmic/30 transition-colors">
          <h3 className="text-base sm:text-lg font-consciousness text-cosmic mb-3">Direct Protocols</h3>
          <div className="space-y-2 sm:space-y-3">
            <a 
              href={`mailto:${node.data.connection_protocols.primary}`}
              className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors p-2 rounded hover:bg-cosmic-whisper/5"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-neural text-sm sm:text-base break-all">{node.data.connection_protocols.primary}</span>
            </a>
            {node.data.connection_protocols.secondary && (
              <a 
                href={`tel:${node.data.connection_protocols.secondary}`}
                className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors p-2 rounded hover:bg-cosmic-whisper/5"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-neural text-sm sm:text-base">{node.data.connection_protocols.secondary}</span>
              </a>
            )}
          </div>
        </div>
        
<div className="holographic-surface rounded-lg p-3 sm:p-4 border border-surface-border hover:border-cosmic/30 transition-colors">
  <h3 className="text-base sm:text-lg font-consciousness text-cosmic mb-3">Network Nodes</h3>
  <div className="space-y-2 sm:space-y-3">
    {node.data.connection_protocols.networks.map((network: any, i: number) => (
      <a 
        key={i}
        href={network.endpoint}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          console.log('Clicking network:', network.protocol, network.endpoint);
          e.stopPropagation();
          e.preventDefault();
          
          // Force navigation using window.open for reliability
          window.open(network.endpoint, '_blank', 'noopener,noreferrer');
        }}
        className="flex items-center gap-3 text-consciousness-secondary hover:text-cosmic transition-colors group p-2 rounded hover:bg-cosmic-whisper/5 block"
        style={{ 
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div className="flex-shrink-0">
          {network.protocol === 'LinkedIn' && <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />}
          {network.protocol === 'GitHub' && <Github className="w-4 h-4 sm:w-5 sm:h-5" />}
          {network.protocol === 'Portfolio' && <Globe className="w-4 h-4 sm:w-5 sm:h-5" />}
          {network.protocol === 'Twitter' && <X className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-neural text-sm sm:text-base">{network.protocol}</div>
          <div className="text-xs text-consciousness-whisper leading-relaxed">
            {network.description}
          </div>
        </div>
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </a>
    ))}
  </div>
</div>
        
        {node.data.availability && (
          <div className="holographic-surface rounded-lg p-3 sm:p-4 border border-surface-border hover:border-cosmic/30 transition-colors">
            <h3 className="text-base sm:text-lg font-consciousness text-cosmic mb-3">Availability Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cosmic rounded-full animate-consciousness-pulse flex-shrink-0" />
                <span className="text-consciousness-secondary font-neural text-sm sm:text-base">
                  {node.data.availability.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <h4 className="text-neural-active font-neural text-xs sm:text-sm mb-2">Preferences</h4>
                <div className="grid gap-1.5 sm:gap-2">
                  {node.data.availability.preferences.map((pref: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-1.5 rounded hover:bg-cosmic-whisper/5 transition-colors">
                      <div className="w-1 h-1 bg-cosmic rounded-full mt-2 flex-shrink-0" />
                      <span className="text-consciousness-secondary text-xs sm:text-sm leading-relaxed">{pref}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm pt-2 border-t border-surface-border">
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-consciousness text-consciousness-primary leading-tight">
          {node.data.name}
        </h2>
        <div className="flex gap-2 flex-shrink-0">
          {node.data.live_consciousness && (
            <a 
              href={node.data.live_consciousness} 
              className="text-cosmic hover:text-cosmic-glow transition-colors p-1 rounded hover:bg-cosmic-whisper/10"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="View live project"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          {node.data.source_code && (
            <a 
              href={node.data.source_code}
              className="text-cosmic hover:text-cosmic-glow transition-colors p-1 rounded hover:bg-cosmic-whisper/10"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="View source code"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-neural-active font-neural text-sm sm:text-base mb-2">Problem Nexus</h3>
          <p className="text-consciousness-secondary leading-relaxed font-consciousness text-sm sm:text-base">
            {node.data.problem_space}
          </p>
        </div>
        
        <div>
          <h3 className="text-neural-active font-neural text-sm sm:text-base mb-2">Solution Architecture</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {node.data.solution_matrix.map((tech: string, i: number) => (
              <span 
                key={i}
                className="px-2 sm:px-3 py-1 bg-cosmic-whisper text-cosmic text-xs sm:text-sm font-neural rounded-full hover:bg-cosmic-whisper/80 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-neural-active font-neural text-sm sm:text-base mb-2">Impact Resonance</h3>
          <div className="grid gap-2 sm:gap-3">
            {node.data.impact_metrics.map((metric: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-2 sm:p-3 holographic-surface rounded border border-surface-border hover:border-cosmic/30 transition-colors">
                <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse mt-1 flex-shrink-0" />
                <span className="text-consciousness-secondary font-consciousness text-sm sm:text-base leading-relaxed">{metric}</span>
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

  // Dynamic panel sizing based on device type
  const getPanelClasses = () => {
    const baseClasses = "fixed thought-bubble transform transition-all duration-silk z-50";
    
    if (isMobile) {
      return `${baseClasses} inset-x-2 top-12 bottom-12 max-h-[calc(100vh-6rem)] overflow-y-auto ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`;
    } else if (isTablet) {
      return `${baseClasses} inset-y-4 right-4 w-[calc(100vw-2rem)] max-w-[500px] overflow-y-auto ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`;
    } else {
      return `${baseClasses} inset-y-0 right-0 w-1/3 min-w-[400px] max-w-[600px] overflow-y-auto ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`;
    }
  };

  const getContentPadding = () => {
    return isMobile ? "p-3 sm:p-4" : "p-4 sm:p-6";
  };

  return (
    <>
      {/* Mobile/Tablet overlay backdrop */}
      {(isMobile || isTablet) && isVisible && (
        <div 
          className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40 transition-opacity duration-silk"
          onClick={onClose}
        />
      )}
      
      <div 
        ref={panelRef}
        className={`${getPanelClasses()} ${getContentPadding()}`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 sticky top-0 bg-inherit z-10 pb-2 border-b border-surface-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
            <span className="text-consciousness-whisper font-neural text-xs sm:text-sm">
              Consciousness Stream Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-consciousness-whisper hover:text-cosmic transition-colors font-neural p-1 sm:p-2 rounded hover:bg-cosmic-whisper/10 group"
            aria-label="Close panel"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
        
        <div className="animate-thought-materialize">
          {renderContent()}
        </div>
        
        {/* Mobile scroll indicator */}
        {isMobile && (
          <div className="sticky bottom-0 h-4 bg-gradient-to-t from-inherit to-transparent pointer-events-none" />
        )}
      </div>
    </>
  );
};

export default ConsciousnessPanel;