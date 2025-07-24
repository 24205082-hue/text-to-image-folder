import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Palette, Download } from 'lucide-react';
import heroImage from '@/assets/ai-hero-bg.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-32 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-12 h-12 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 left-1/3 w-14 h-14 bg-primary-glow/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in">
          {/* Logo/Icon */}
          <div className="w-24 h-24 bg-gradient-ai rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-glow animate-pulse-glow">
            <Sparkles className="w-12 h-12 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-ai bg-clip-text text-transparent leading-tight">
            AI Image Studio
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Transform your imagination into stunning visuals with the power of artificial intelligence
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center space-x-2 bg-glass/50 backdrop-blur-sm rounded-full px-4 py-2 border border-glass-border">
              <Zap className="w-4 h-4 text-primary" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2 bg-glass/50 backdrop-blur-sm rounded-full px-4 py-2 border border-glass-border">
              <Palette className="w-4 h-4 text-secondary" />
              <span>Multiple Styles</span>
            </div>
            <div className="flex items-center space-x-2 bg-glass/50 backdrop-blur-sm rounded-full px-4 py-2 border border-glass-border">
              <Download className="w-4 h-4 text-accent" />
              <span>HD Downloads</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            size="lg"
            className="btn-ai text-lg px-8 py-6 h-auto font-semibold pulse-glow hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating
          </Button>
          
          {/* Additional Info */}
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free to try • Professional quality
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}