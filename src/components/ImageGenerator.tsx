import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Download, RefreshCw, Sparkles, Moon, Sun, Settings, History, Heart } from 'lucide-react';
import HeroSection from './HeroSection';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
  isFavorite?: boolean;
}

const STYLE_OPTIONS = [
  { value: 'realistic', label: 'Realistic' },
  { value: '3d', label: '3D Render' },
  { value: 'anime', label: 'Anime' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'oil-painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'fantasy', label: 'Fantasy' },
];

const SURPRISE_PROMPTS = [
  "A majestic dragon soaring through neon-lit clouds",
  "A crystal palace floating in a galaxy of stars",
  "A steampunk robot gardening in a magical greenhouse",
  "A cyberpunk city reflected in a cat's eyes",
  "An ancient tree with galaxies growing as fruits",
  "A lighthouse made of aurora borealis",
  "A vintage car driving through a digital matrix",
  "A phoenix made of liquid gold and fire",
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const generatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for saved API key
    const savedApiKey = localStorage.getItem('clipdrop-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiDialog(true);
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Load saved images and favorites
    const savedImages = localStorage.getItem('generated-images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }

    const savedFavorites = localStorage.getItem('favorite-images');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    localStorage.setItem('clipdrop-api-key', apiKey);
    setShowApiDialog(false);
    toast.success('API key saved successfully!');
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your image');
      return;
    }

    if (!apiKey) {
      setShowApiDialog(true);
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('prompt', `${prompt}, ${style} style`);

      const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        style,
        timestamp: Date.now(),
      };

      const updatedImages = [newImage, ...images];
      setImages(updatedImages);
      localStorage.setItem('generated-images', JSON.stringify(updatedImages));

      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const surpriseMe = () => {
    const randomPrompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(randomPrompt);
    toast.success('Surprise prompt loaded! 🎨');
  };

  const regenerateImage = (imagePrompt: string, imageStyle: string) => {
    setPrompt(imagePrompt);
    setStyle(imageStyle);
    setTimeout(() => generateImage(), 100);
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const toggleFavorite = (imageId: string) => {
    const newFavorites = favorites.includes(imageId)
      ? favorites.filter(id => id !== imageId)
      : [...favorites, imageId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite-images', JSON.stringify(newFavorites));
  };

  const scrollToGenerator = () => {
    setShowHero(false);
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-glow opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--secondary))_0%,transparent_50%)] opacity-20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent))_0%,transparent_50%)] opacity-20" />

      {/* Hero Section */}
      {showHero && <HeroSection onGetStarted={scrollToGenerator} />}

      {/* Header */}
      <header className={`relative z-10 p-6 flex justify-between items-center ${showHero ? 'fixed top-0 left-0 right-0' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-ai rounded-lg flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-ai bg-clip-text text-transparent">
            AI Image Studio
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-5 h-5" />
          </Button>
          
          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowApiDialog(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button
            variant="glass"
            size="icon"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={generatorRef} className={`relative z-10 container mx-auto px-6 pb-20 ${showHero ? 'pt-20' : 'pt-6'}`}>
        {/* Generator Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="glass-card p-8 float-animation">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Create Amazing AI Art</h2>
                <p className="text-muted-foreground">
                  Transform your imagination into stunning visuals with AI
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt" className="text-sm font-medium">
                    Describe your image
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="glass-input min-h-[100px] mt-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        generateImage();
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="glass-input mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={surpriseMe}
                      variant="glass"
                      className="w-full"
                      disabled={isGenerating}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Surprise Me
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  variant="ai"
                  className="w-full h-12 text-lg font-medium pulse-glow"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Creations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="glass-card p-4 image-fade-in group">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                        {STYLE_OPTIONS.find(s => s.value === image.style)?.label}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(image.id)}
                        className="h-8 w-8"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(image.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => downloadImage(image.url, `ai-art-${image.id}`)}
                        variant="glass"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        onClick={() => regenerateImage(image.prompt, image.style)}
                        variant="glass"
                        size="sm"
                        className="flex-1"
                        disabled={isGenerating}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* API Key Dialog */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent className="glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle>Configure Clipdrop API</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To use this app, you need a Clipdrop API key. Get yours at{' '}
              <a 
                href="https://clipdrop.co/apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                clipdrop.co/apis
              </a>
            </p>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Clipdrop API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="glass-input mt-2"
              />
            </div>
            <Button onClick={saveApiKey} variant="ai" className="w-full">
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}