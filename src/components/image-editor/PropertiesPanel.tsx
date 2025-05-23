'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface EditorState {
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  overlayOpacity: number;
  logoUrl: string;
  websiteText: string;
  websiteTextColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

interface PropertiesPanelProps {
  editorState: EditorState;
  onChange: (state: EditorState) => void;
}

export default function PropertiesPanel({ editorState, onChange }: PropertiesPanelProps) {
  const updateState = (updates: Partial<EditorState>) => {
    onChange({ ...editorState, ...updates });
  };

  return (
    <>
      {/* Text Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editorState.title}
              onChange={(e) => updateState({ title: e.target.value })}
              placeholder="Enter title..."
            />
          </div>
          
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={editorState.subtitle}
              onChange={(e) => updateState({ subtitle: e.target.value })}
              placeholder="Enter subtitle..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titleColor">Title Color</Label>
              <Input
                id="titleColor"
                type="color"
                value={editorState.titleColor}
                onChange={(e) => updateState({ titleColor: e.target.value })}
                className="h-10"
              />
            </div>
            
            <div>
              <Label htmlFor="subtitleColor">Subtitle Color</Label>
              <Input
                id="subtitleColor"
                type="color"
                value={editorState.subtitleColor}
                onChange={(e) => updateState({ subtitleColor: e.target.value })}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Opacity: {editorState.overlayOpacity}%</Label>
            <Slider
              value={[editorState.overlayOpacity]}
              onValueChange={([value]: number[]) => updateState({ overlayOpacity: value })}
              max={100}
              min={0}
              step={5}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle>Adjustments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Brightness: {editorState.brightness > 0 ? '+' : ''}{editorState.brightness}%</Label>
            <Slider
              value={[editorState.brightness]}
              onValueChange={([value]: number[]) => updateState({ brightness: value })}
              max={100}
              min={-100}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Contrast: {editorState.contrast > 0 ? '+' : ''}{editorState.contrast}%</Label>
            <Slider
              value={[editorState.contrast]}
              onValueChange={([value]: number[]) => updateState({ contrast: value })}
              max={100}
              min={-100}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Saturation: {editorState.saturation > 0 ? '+' : ''}{editorState.saturation}%</Label>
            <Slider
              value={[editorState.saturation]}
              onValueChange={([value]: number[]) => updateState({ saturation: value })}
              max={100}
              min={-100}
              step={5}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo and Website URL Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo Image URL</Label>
            <Input
              id="logoUrl"
              value={editorState.logoUrl}
              onChange={(e) => updateState({ logoUrl: e.target.value })}
              placeholder="Enter logo image URL..."
            />
          </div>
          <div>
            <Label htmlFor="websiteText">Website Text</Label>
            <Input
              id="websiteText"
              value={editorState.websiteText}
              onChange={(e) => updateState({ websiteText: e.target.value })}
              placeholder="Enter website text..."
            />
          </div>
          <div>
            <Label htmlFor="websiteTextColor">Website Text Color</Label>
            <Input
              id="websiteTextColor"
              type="color"
              value={editorState.websiteTextColor}
              onChange={(e) => updateState({ websiteTextColor: e.target.value })}
              className="h-10"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
