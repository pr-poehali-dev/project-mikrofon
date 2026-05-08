import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Projects } from "../components/Projects"
import { Expertise } from "../components/Expertise"
import { Packages } from "../components/Packages"
import { WhyUs } from "../components/WhyUs"
import { Process } from "../components/Process"
import { Reviews } from "../components/Reviews"
import { FAQ } from "../components/FAQ"
import { CallToAction } from "../components/CallToAction"
import { Footer } from "../components/Footer"

export default function Index() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Projects />
      <Expertise />
      <Packages />
      <WhyUs />
      <Process />
      <Reviews />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  )
}
