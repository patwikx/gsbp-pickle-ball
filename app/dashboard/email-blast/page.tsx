import { Suspense } from 'react';
import EmailBlastForm from './components/email-blast-form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailBlastPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaign</h1>
          <p className="text-muted-foreground">
            Create and send email campaigns to your users
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>New Email Campaign</CardTitle>
            <CardDescription>
              Create a new email campaign to send to your users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <EmailBlastForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}