import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  ArrowRight,
  ImageIcon,
  Heart,
  FolderOpen,
  Shield,
  Search,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('/placeholder.svg?height=1080&width=1920&text=Beautiful+Gallery')",
            filter: "brightness(0.7)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Organize Your Memories
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A beautiful way to store, organize, and share your photos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/20"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Photo Management
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              icon={<ImageIcon className="h-10 w-10" />}
              title="Smart Organization"
              description="Automatically organize your photos by date, location, and content."
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10" />}
              title="Favorites Collection"
              description="Mark your favorite photos and access them quickly in one place."
            />
            <FeatureCard
              icon={<FolderOpen className="h-10 w-10" />}
              title="Custom Albums"
              description="Create albums for special events, trips, or any collection you want."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Secure Storage"
              description="Your photos are securely stored and backed up automatically."
            />
            <FeatureCard
              icon={<Search className="h-10 w-10" />}
              title="Powerful Search"
              description="Find any photo instantly with our powerful search capabilities."
            />
            <FeatureCard
              icon={<ArrowRight className="h-10 w-10" />}
              title="Easy Sharing"
              description="Share photos and albums with friends and family with just a few clicks."
            />
          </div>
        </div>
      </section>

      {/* Showcase Section 1 */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('/placeholder.svg?height=1080&width=1920&text=Beautiful+Organization')",
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">Beautiful Organization</h2>
            <p className="text-xl mb-8">
              Our intuitive interface makes it easy to organize thousands of
              photos. With smart tagging and powerful search, you&apos;ll never
              lose track of a memory again.
            </p>
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/register">Try It Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Showcase Section 2 */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('/placeholder.svg?height=1080&width=1920&text=Smart+Albums')",
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-white flex justify-end">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">Smart Albums</h2>
            <p className="text-xl mb-8">
              Create albums for any occasion or let our AI suggest collections
              based on events, locations, or people. Share albums with friends
              and family with just a few clicks.
            </p>
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/register">Start Organizing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Showcase Section 3 */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('/placeholder.svg?height=1080&width=1920&text=Secure+Storage')",
            filter: "brightness(0.3)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">Secure Storage</h2>
            <p className="text-xl mb-8">
              Your memories are precious. That&apos;s why we use bank-level
              encryption and automatic backups to ensure your photos are safe
              and accessible from any device.
            </p>
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/register">Secure Your Photos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This app has completely changed how I organize my photos. I can finally find everything!"
              author="Sarah J."
            />
            <TestimonialCard
              quote="The interface is beautiful and intuitive. I've recommended it to all my friends."
              author="Michael T."
            />
            <TestimonialCard
              quote="I love how easy it is to share albums with my family without compromising privacy."
              author="Elena R."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Organize Your Photos?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed how they store and
            share their memories.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/register">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <p className="italic mb-4">{quote}</p>
      <p className="font-semibold text-right">— {author}</p>
    </div>
  );
}
