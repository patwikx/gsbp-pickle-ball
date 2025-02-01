'use client'

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { sendEmailBlast } from '@/actions/email-blast';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';

const emailBlastSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  template: z.enum(['MARKETING', 'SYSTEM_UPDATE', 'ANNOUNCEMENT']),
  content: z.string().min(1, 'Content is required'),
  sendToAll: z.boolean(),
  testEmail: z.string().email().optional(),
});

type EmailBlastForm = z.infer<typeof emailBlastSchema>;

const TEMPLATE_CONTENT = {
  MARKETING: `
    <h2>🌟 Introducing Our Latest Innovation</h2>
    <p>Dear Valued Customer,</p>
    <p>We're excited to share some groundbreaking news with you. Our team has been working tirelessly to bring you the next generation of enterprise solutions.</p>
    
    <h3>✨ What's New?</h3>
    <ul>
      <li>🔒 Enhanced Security Features</li>
      <li>📈 Improved Performance Metrics</li>
      <li>📊 Advanced Analytics Dashboard</li>
      <li>🔄 Seamless Integration Capabilities</li>
    </ul>

    <h3>🎉 Special Offer</h3>
    <p>As a valued customer, you get exclusive early access to these features with a special 20% discount when you upgrade within the next 30 days.</p>

    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #1a73e8;">
      <strong>💎 Limited Time Offer:</strong>
      <ul>
        <li>🎯 Premium Support Package</li>
        <li>🚀 Free Migration Assistance</li>
        <li>👥 Dedicated Account Manager</li>
      </ul>
    </div>

    <p>Ready to elevate your business? Contact our enterprise sales team today.</p>

    <p>Best regards,<br>
    The Enterprise Team</p>
  `,
  SYSTEM_UPDATE: `
    <h2>🔄 System Update & New Features - February 2025</h2>
    <p>Dear Users,</p>

    <div style="background-color: #e3f2fd; padding: 15px; margin: 20px 0; border-left: 4px solid #1976d2;">
      <strong>📦 Release Version:</strong> 4.2.1
    </div>

    <h3>🚀 New Features</h3>
    <ul>
      <li><strong>📊 Advanced Dashboard Analytics</strong>
        <ul>
          <li>⚡ Real-time data visualization</li>
          <li>🎨 Customizable widgets</li>
          <li>📤 Enhanced export capabilities</li>
        </ul>
      </li>
      <li><strong>⚙️ Workflow Automation</strong>
        <ul>
          <li>📝 New automation templates</li>
          <li>🎯 Improved trigger conditions</li>
          <li>🔄 Integration with external systems</li>
        </ul>
      </li>
    </ul>

    <h3>🛠️ Improvements</h3>
    <ul>
      <li><strong>⚡ Performance</strong>
        <ul>
          <li>🚀 50% faster page load times</li>
          <li>📊 Optimized database queries</li>
          <li>💾 Reduced memory usage</li>
        </ul>
      </li>
      <li><strong>🎨 User Interface</strong>
        <ul>
          <li>✨ Refreshed design system</li>
          <li>📱 Improved mobile responsiveness</li>
          <li>♿ New accessibility features</li>
        </ul>
      </li>
    </ul>

    <h3>🐛 Bug Fixes</h3>
    <ul>
      <li>📊 Fixed data export formatting issues</li>
      <li>🔔 Resolved notification delivery delays</li>
      <li>📱 Fixed mobile navigation menu bugs</li>
    </ul>

    <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <strong>📝 Note:</strong> Please refresh your browser to ensure you're using the latest version.
    </div>

    <p>For detailed documentation of these changes, visit our knowledge base.</p>

    <p>Best regards,<br>
    Product Development Team</p>
  `,
  ANNOUNCEMENT: `
    <h2>📢 Important Company Announcement</h2>
    <p>Dear Team Members,</p>

    <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-left: 4px solid #4caf50;">
      <strong>🎯 Strategic Growth Initiative Launch</strong>
    </div>

    <p>We are pleased to announce the launch of our new strategic growth initiative, aimed at strengthening our market position and expanding our global presence.</p>

    <h3>🌟 Key Highlights</h3>
    <ul>
      <li>🏢 New Regional Headquarters Opening</li>
      <li>🤝 Strategic Partnerships Development</li>
      <li>🔬 Innovation Lab Launch</li>
      <li>👥 Talent Development Program</li>
    </ul>

    <h3>📅 Timeline</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background-color: #f8f9fa;">
        <th style="padding: 10px; border: 1px solid #dee2e6;">Phase</th>
        <th style="padding: 10px; border: 1px solid #dee2e6;">Timeline</th>
        <th style="padding: 10px; border: 1px solid #dee2e6;">Key Deliverables</th>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Phase 1</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Q1 2024</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Infrastructure Setup</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Phase 2</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Q2 2024</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">Program Launch</td>
      </tr>
    </table>

    <h3>⏭️ Next Steps</h3>
    <p>Department heads will schedule detailed briefings with their teams in the coming weeks.</p>

    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
      <p>📚 For more information, please visit the company intranet or contact your department manager.</p>
    </div>

    <p>We look forward to your continued support and collaboration.</p>

    <p>Best regards,<br>
    Executive Leadership Team</p>
  `
};

const EMAIL_TEMPLATES = {
  MARKETING: {
    layout: (content: string) => `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #1a73e8; margin: 0;">🏸 General Santos Business Park Pickleball Court</h1>
        </div>
        <div style="padding: 20px;">
          ${content}
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0;">© 2025 General Santos Business Park Pickleball Court. All rights reserved.</p>
        </div>
      </div>
    `,
  },
  SYSTEM_UPDATE: {
    layout: (content: string) => `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #e3f2fd; padding: 20px; text-align: center;">
          <h1 style="color: #0d47a1; margin: 0;">🏸 General Santos Business Park Pickleball Court</h1>
        </div>
        <div style="padding: 20px;">
          ${content}
        </div>
        <div style="background-color: #e3f2fd; padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0;">© 2025 General Santos Business Park Pickleball Court - System Update</p>
        </div>
      </div>
    `,
  },
  ANNOUNCEMENT: {
    layout: (content: string) => `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #ffd700; padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0;">🏸 General Santos Business Park Pickleball Court</h1>
        </div>
        <div style="padding: 20px;">
          ${content}
        </div>
        <div style="background-color: #ffd700; padding: 20px; text-align: center;">
          <p style="color: #000; margin: 0;">© 2025 General Santos Business Park Pickleball Court - Important Announcement</p>
        </div>
      </div>
    `,
  },
};

export default function EmailBlastForm() {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EmailBlastForm>({
    resolver: zodResolver(emailBlastSchema),
    defaultValues: {
      subject: '',
      template: 'MARKETING',
      content: TEMPLATE_CONTENT.MARKETING,
      sendToAll: true,
      testEmail: '',
    },
  });

  const updatePreview = (template: keyof typeof EMAIL_TEMPLATES, content: string) => {
    const html = EMAIL_TEMPLATES[template].layout(content);
    setPreviewHtml(html);
  };

  const onSubmit = async (data: EmailBlastForm) => {
    try {
      setIsSubmitting(true);
      const html = EMAIL_TEMPLATES[data.template].layout(data.content);
      const result = await sendEmailBlast({
        ...data,
        html,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Email blast has been sent successfully!',
        });
        form.reset();
      } else {
        throw new Error(result.error);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send email blast. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="compose">
      <TabsList>
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="compose">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Email subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      field.onChange(value);
                      // Update content with template-specific content
                      const templateType = value as keyof typeof TEMPLATE_CONTENT;
                      form.setValue('content', TEMPLATE_CONTENT[templateType]);
                      updatePreview(templateType, TEMPLATE_CONTENT[templateType]);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="SYSTEM_UPDATE">System Update</SelectItem>
                      <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey={process.env.TINYMCE_API_KEY}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                          'bold italic forecolor backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | table link image media | help',
                        content_style: `
                          body { 
                            font-family: Arial, sans-serif; 
                            font-size: 14px; 
                            line-height: 1.5;
                            max-width: 100%;
                            padding: 20px;
                          }
                          table {
                            border-collapse: collapse;
                            width: 100%;
                            margin-bottom: 1em;
                          }
                          table td, table th {
                            border: 1px solid #ddd;
                            padding: 8px;
                          }
                          img {
                            max-width: 100%;
                            height: auto;
                          }
                        `
                      }}
                      value={field.value}
                      onEditorChange={(content) => {
                        field.onChange(content);
                        updatePreview(form.getValues('template'), content);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendToAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Send to all users</FormLabel>
                    <FormDescription>
                      Toggle to send to all users or use test email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!form.watch('sendToAll') && (
              <FormField
                control={form.control}
                name="testEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="test@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Email Blast'
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}