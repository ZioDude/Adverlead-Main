// services/canvasEditor.ts

interface CanvasEditorOptions {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  titleColor?: string;
  subtitleColor?: string;
  websiteText?: string;
  websiteTextColor?: string;
  overlayOpacity?: number; // 0-1 range
  logoText?: string;
  logoTextColor?: string;
}

export class CanvasEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = context;
  }

  private wrapText(text: string, maxWidth: number, font: string): string[] {
    const originalFont = this.ctx.font;
    this.ctx.font = font; // Set font for accurate measurement
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const { width: testWidth } = this.ctx.measureText(testLine);
      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    this.ctx.font = originalFont; // Reset font
    return lines;
  }

  private async loadImage(src: string, timeout: number = 10000): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let timer: NodeJS.Timeout;

      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };
      img.onerror = (err) => {
        clearTimeout(timer);
        console.error(`Failed to load image: ${src}`, err);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;

      timer = setTimeout(() => {
        img.onload = null; // Prevent late load from resolving
        img.onerror = null; // Prevent late error from rejecting
        reject(new Error(`Image load timed out for: ${src}`));
      }, timeout);
    });
  }

  private async addLogo(
    logoUrl: string
    // logoText and logoTextColor removed as text should be part of the logo image
  ): Promise<void> {
    try {
      const logoImg = await this.loadImage(logoUrl);
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      // Dynamic logo sizing (same as ImageEditor.tsx)
      const logoMaxHeight = canvasHeight * 0.1; // Max 10% of canvas height
      const scale = Math.min(logoMaxHeight / logoImg.height, (canvasWidth * 0.3) / logoImg.width);
      
      const logoRenderWidth = logoImg.width * scale;
      const logoRenderHeight = logoImg.height * scale;
      
      // Center the logo (same as ImageEditor.tsx)
      const logoX = (canvasWidth - logoRenderWidth) / 2;
      const logoY = canvasHeight * 0.05; // 5% padding from top

      this.ctx.drawImage(logoImg, logoX, logoY, logoRenderWidth, logoRenderHeight);

      // Removed separate logo text drawing logic.
      // The "Adverlead" text should be part of the logo image itself.

    } catch (error) {
      console.warn('Logo could not be added:', error);
      // Continue without logo if it fails
    }
  }

  private addTextElements(
    title: string,
    subtitle: string,
    titleColor: string,
    subtitleColor: string,
    websiteText: string,
    websiteTextColor: string
  ): void {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Common text properties
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top'; // Consistent baseline for multi-line

    // Shadow for readability
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    this.ctx.shadowBlur = 7;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    // Title
    const titleFontSize = Math.max(28, canvasWidth * 0.065); // Matched ImageEditor.tsx
    const titleFont = `bold ${titleFontSize}px system-ui, -apple-system, sans-serif`;
    const titleLineHeight = titleFontSize * 1.2; // Matched ImageEditor.tsx
    // const titleMaxWidth = canvasWidth * 0.9; // Not using wrapText for title anymore
    const titleLines = title.split('\n'); // Use pre-defined newlines
    
    let currentY = canvasHeight * 0.30; // Matched ImageEditor.tsx
    const leftPadding = canvasWidth * 0.05; // Matched ImageEditor.tsx

    this.ctx.fillStyle = titleColor;
    this.ctx.font = titleFont;
    titleLines.forEach((line) => {
      this.ctx.fillText(line, leftPadding, currentY);
      currentY += titleLineHeight;
    });

    // Subtitle
    if (subtitle) {
      const subtitleFontSize = Math.max(20, canvasWidth * 0.035); // Matched ImageEditor.tsx
      // currentY += titleLineHeight * 0.3; // Small gap after title - ImageEditor.tsx uses subtitleFontSize * 0.5
      currentY += subtitleFontSize * 0.5; // Matched ImageEditor.tsx for gap
      const subtitleFont = `${subtitleFontSize}px system-ui, -apple-system, sans-serif`;
      const subtitleLineHeight = subtitleFontSize * 1.2; // Matched ImageEditor.tsx
      // const subtitleMaxWidth = canvasWidth * 0.9; // Not using wrapText for subtitle anymore
      const subtitleLines = subtitle.split('\n'); // Use pre-defined newlines

      this.ctx.fillStyle = subtitleColor;
      this.ctx.font = subtitleFont;
      subtitleLines.forEach((line) => {
        this.ctx.fillText(line, leftPadding, currentY);
        currentY += subtitleLineHeight;
      });
    }
    
    // Clear shadow for website text (same as ImageEditor.tsx)
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;

    // Website URL
    if (websiteText) {
      const websiteFontSize = Math.max(16, canvasWidth * 0.022);
      this.ctx.font = `${websiteFontSize}px system-ui, -apple-system, sans-serif`;
      this.ctx.fillStyle = websiteTextColor;
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'bottom';
      const websiteY = canvasHeight * 0.95; // 5% padding from bottom
      this.ctx.fillText(websiteText, leftPadding, websiteY);
    }
  }

  public async applyDefaultEdit(
    imageUrl: string,
    options: CanvasEditorOptions = {}
  ): Promise<string> {
    // Default values from ImageEditor.tsx initialEditorState
    const defaultTitle = 'Personalized Renovations\nFor Your Unique\nLifestyle';
    const defaultSubtitle = 'Where quality meets innovation\nin home renovation';
    const defaultTitleColor = '#ffffff';
    const defaultSubtitleColor = '#ffffff';
    const defaultOverlayOpacity = 0.9; // 90 from ImageEditor, converted to 0-1 scale
    const defaultLogoUrl = 'https://pvvvbzllhtfrdirafduh.supabase.co/storage/v1/object/public/ad-images/3e252d62-6306-49d4-9ae2-611f68ffa331/temp-edit-3e252d62-6306-49d4-9ae2-611f68ffa331-adverlead_logo-1747952117957.png';
    const defaultWebsiteText = 'www.adverlead-renovations.com';
    const defaultWebsiteTextColor = '#ffffff';
    // const defaultLogoText = "Adverlead"; // No longer using separate logo text
    // const defaultLogoTextColor = "#FFFFFF";


    const {
      title = defaultTitle,
      subtitle = defaultSubtitle,
      logoUrl = defaultLogoUrl,
      titleColor = defaultTitleColor,
      subtitleColor = defaultSubtitleColor,
      websiteText = defaultWebsiteText,
      websiteTextColor = defaultWebsiteTextColor,
      overlayOpacity = defaultOverlayOpacity,
      // logoText and logoTextColor are no longer taken from options here
      // as they are not used in the updated addLogo method.
    } = options;

    try {
      const baseImage = await this.loadImage(imageUrl);
      
      this.canvas.width = baseImage.width;
      this.canvas.height = baseImage.height;

      // Draw the original image
      this.ctx.drawImage(baseImage, 0, 0);

      // Apply gradient dark overlay (matched ImageEditor.tsx)
      const gradientEndX = this.canvas.width * 0.9; 
      const gradient = this.ctx.createLinearGradient(0, 0, gradientEndX, 0);
      // For overlayOpacity, ImageEditor.tsx uses state.overlayOpacity / 100
      // Our defaultOverlayOpacity is already 0.9 (from 90/100)
      gradient.addColorStop(0, `rgba(0, 0, 0, ${overlayOpacity})`); 
      gradient.addColorStop(0.5, `rgba(0, 0, 0, ${overlayOpacity * 0.7})`); // Matched ImageEditor.tsx
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`); 
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Add logo (awaits logo loading internally)
      if (logoUrl) {
        await this.addLogo(logoUrl); // Removed logoText and logoTextColor arguments
      }
      
      // Add text elements
      this.addTextElements(
        title,
        subtitle,
        titleColor,
        subtitleColor,
        websiteText,
        websiteTextColor
      );
      
      return this.canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error during canvas editing:', error);
      // In case of error, return a blank canvas data URL or rethrow
      // For now, rethrowing to be handled by the caller
      throw error; 
    }
  }
}
