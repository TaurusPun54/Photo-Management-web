"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only showing theme controls after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container max-w-2xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the application looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Theme</h3>
                <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  The theme setting controls the appearance of the application. Light mode is bright and suitable for
                  daytime use, while dark mode reduces eye strain in low-light environments. System mode automatically
                  matches your device&apos;s theme settings.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Account settings will be available soon.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>Manage your privacy and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Privacy and security settings will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
