import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"
import { SocialBar } from "@/components/social-bar"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <CTABanner />
      <Footer />
      <SocialBar />
    </main>
  )
}
