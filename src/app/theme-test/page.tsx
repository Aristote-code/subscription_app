"use client";

import React from "react";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Theme Test Page</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Background Colors</CardTitle>
              <CardDescription>
                Testing background color variables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background border rounded-md">
                bg-background
              </div>
              <div className="p-4 bg-card border rounded-md">bg-card</div>
              <div className="p-4 bg-primary text-primary-foreground rounded-md">
                bg-primary
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
                bg-secondary
              </div>
              <div className="p-4 bg-muted text-muted-foreground rounded-md">
                bg-muted
              </div>
              <div className="p-4 bg-accent text-accent-foreground rounded-md">
                bg-accent
              </div>
              <div className="p-4 bg-destructive text-destructive-foreground rounded-md">
                bg-destructive
              </div>
              <div className="p-4 bg-popover text-popover-foreground rounded-md">
                bg-popover
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text Colors</CardTitle>
              <CardDescription>Testing text color variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">text-foreground</p>
              <p className="text-primary">text-primary</p>
              <p className="text-secondary">text-secondary</p>
              <p className="text-muted-foreground">text-muted-foreground</p>
              <p className="text-accent-foreground">text-accent-foreground</p>
              <p className="text-destructive">text-destructive</p>
              <p className="text-popover-foreground">text-popover-foreground</p>
              <p className="text-card-foreground">text-card-foreground</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Border Colors</CardTitle>
              <CardDescription>Testing border color variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">Default border</div>
              <div className="p-4 border-2 border-primary rounded-md">
                border-primary
              </div>
              <div className="p-4 border-2 border-secondary rounded-md">
                border-secondary
              </div>
              <div className="p-4 border-2 border-muted rounded-md">
                border-muted
              </div>
              <div className="p-4 border-2 border-accent rounded-md">
                border-accent
              </div>
              <div className="p-4 border-2 border-destructive rounded-md">
                border-destructive
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UI Components</CardTitle>
              <CardDescription>
                Testing components with theme variables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>

              <div className="mb-4">
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="tab1"
                    className="p-4 border rounded-md mt-2"
                  >
                    Tab 1 content
                  </TabsContent>
                  <TabsContent
                    value="tab2"
                    className="p-4 border rounded-md mt-2"
                  >
                    Tab 2 content
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="test-input">Input field</Label>
                <Input id="test-input" placeholder="Test input" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hover States</CardTitle>
            <CardDescription>
              Testing hover effects with theme variables
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background hover:bg-secondary transition-colors duration-200 rounded-md border">
              hover:bg-secondary
            </div>
            <div className="p-4 bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200 rounded-md border">
              hover:bg-primary
            </div>
            <div className="p-4 bg-background hover:bg-muted transition-colors duration-200 rounded-md border">
              hover:bg-muted
            </div>
            <div className="p-4 bg-background hover:bg-accent transition-colors duration-200 rounded-md border">
              hover:bg-accent
            </div>
            <div className="p-4 bg-background hover:border-primary border transition-colors duration-200 rounded-md">
              hover:border-primary
            </div>
            <div className="p-4 text-foreground hover:text-primary transition-colors duration-200 rounded-md border">
              hover:text-primary
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nested Components</CardTitle>
            <CardDescription>
              Testing nested components with theme variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle>Nested Card</CardTitle>
                <CardDescription>
                  This is a nested card with secondary background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Content inside a nested card</p>
                <div className="p-4 bg-background rounded-md">
                  <p>Inner content with background color</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Cancel</Button>
                <Button className="ml-2">Submit</Button>
              </CardFooter>
            </Card>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Back</Button>
            <Button>Continue</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
