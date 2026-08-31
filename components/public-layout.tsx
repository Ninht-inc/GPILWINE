import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
