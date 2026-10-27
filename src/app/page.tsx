import Cursor from "@/components/Cursor";
import Companion from "@/components/Companion";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import Stack from "@/components/sections/Stack";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Showcase />
        <Stack />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Companion />
      <Cursor />
    </>
  );
}
