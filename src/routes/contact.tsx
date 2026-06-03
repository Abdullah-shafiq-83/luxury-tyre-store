import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TyreLux" },
      { name: "description", content: "Get in touch with the TyreLux team. We're here to help with fitment, sizing, and bespoke orders." },
      { property: "og:title", content: "Contact TyreLux" },
      { property: "og:description", content: "Get in touch with the TyreLux team for fitment, sizing, and bespoke orders." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://luxury-tyre-store.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://luxury-tyre-store.lovable.app/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "TyreLux",
          image: "https://luxury-tyre-store.lovable.app/favicon.svg",
          url: "https://luxury-tyre-store.lovable.app/contact",
          telephone: "+1-555-012-3456",
          email: "hello@tyrelux.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "221 Sunset Blvd",
            addressLocality: "Los Angeles",
            addressRegion: "CA",
            addressCountry: "US",
          },
        }),
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Questions about fitment or a bespoke order? Our team replies within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
          <div className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: "hello@tyrelux.com" },
              { Icon: Phone, label: "Phone", value: "+1 (555) 012-3456" },
              { Icon: MapPin, label: "Showroom", value: "221 Sunset Blvd, LA" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="glass-card rounded-xl p-5 flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thanks! We'll be in touch shortly.");
              (e.target as HTMLFormElement).reset();
            }}
            className="glass-card rounded-xl p-6 md:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
            </div>
            <div>
              <Label htmlFor="subj">Subject</Label>
              <Input id="subj" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" rows={5} required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover-lift">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
