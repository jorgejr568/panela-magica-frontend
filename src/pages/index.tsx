import {Inter} from "next/font/google";
import {Footer, Main, Navbar} from "@/components";
import {Receita, ReceitasAPI} from "@/API/receita";
import {GetServerSidePropsResult} from "next";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import Link from "next/link";

const inter = Inter({subsets: ["latin"]});

type HomeProps = { receitas: Receita[] }

export default function Home({receitas}: HomeProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>

      <Main>
        <h1
          className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
          As melhores receitas para você
        </h1>

        <section className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-2'>
          {receitas.map((receita) => (
            <Link href={`/receitas/${receita.id}`} className="rounded-lg border bg-card text-card-foreground shadow-sm"
                  key={receita.id}>
              <div className="aspect-card overflow-hidden rounded-lg">
                <Image
                  src={receita.imagem}
                  width="400"
                  height="225"
                  alt="Roasted Chicken"
                  className="aspect object-cover w-full"
                  style={{aspectRatio: "400/225", objectFit: "cover"}}
                />
              </div>
              <div className="p-0 mt-4">
                <div className="grid gap-2 py-2 px-4">
                  <h2 className="text-2xl font-semibold leading-none">{receita.nome}</h2>
                  <p className="text-sm/relaxed">por {receita.criador}</p>
                  <p className="text-sm/relaxed text-slate-500">{humanReadableInterval(receita.data_de_criacao)}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

      </Main>
      <Footer/>
    </div>
  );
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<HomeProps>> {
  const receitas = await ReceitasAPI.listar()
  return {props: {receitas}}
}
