'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ToolPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Tool selection will be available here.</p>
        {/* Placeholder for actual tools */}
      </CardContent>
    </Card>
  );
}
