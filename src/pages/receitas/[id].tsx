import {Receita, ReceitasAPI} from "@/API/receita";
import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import {Footer, Main, Navbar} from "@/components";
import Markdown from "react-markdown";

type PaginaReceitaUnicaProps = { receita: Receita }
export default function PaginaReceitaUnica({receita}: PaginaReceitaUnicaProps) {
  return <div className="flex flex-col min-h-screen">
    <Navbar/>

    <Main className="grid lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2 order-2 md:order-1">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
          {receita.nome}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <Image
              alt={`Imagem do criador ${receita.criador}`}
              className="rounded-full"
              height={50}
              src={`/cozinheiros/cozinheiro-${(receita.id % 5) + 1}.jpeg`}
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width={50}
            />
            <div className="text-sm font-medium">{receita.criador}</div>
          </div>
          <div
            className="text-sm font-medium text-gray-500 dark:text-gray-400">{humanReadableInterval(receita.data_de_criacao)}</div>
        </div>
        <div className="prose prose-gray max-w-none w-full flex flex-col gap-16">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl md:tracking-tighter/[-.5] lg:text-4xl lg:tracking-normal">Ingredientes</h2>
            <table className='mt-4'>
              <tbody>
              {receita.ingredientes.map((ingrediente, index) => {
                return <tr key={index}>
                  <td className="p-2 pr-8 border">{ingrediente.nome}</td>
                  <td className="p-2 px-4 border">{ingrediente.quantidade}</td>
                </tr>
              })}
              </tbody>
            </table>
          </div>
          <div>
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl md:tracking-tighter/[-.5] lg:text-4xl lg:tracking-normal">
              Modo de preparo
            </h2>

            <Markdown className='prose'>
              {receita.modo_de_preparo}
            </Markdown>
          </div>
        </div>
      </div>
      <div className="flex items-start order-1 md:order-2">
        <div className="grid gap-2">
          <Image
            alt={`Imagem da receita ${receita.nome}`}
            className="aspect-square overflow-hidden rounded-lg object-cover object-center"
            height={400}
            src={receita.imagem}
            width={400}
          />
        </div>
      </div>
    </Main>

    <Footer/>
  </div>
}

export async function getServerSideProps({params}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PaginaReceitaUnicaProps>> {
  const receitaID = params?.id
  if (typeof receitaID !== "string") {
    return {
      notFound: true
    }
  }

  const receita = await ReceitasAPI.buscar(Number(receitaID))

  if (!receita) {
    return {
      notFound: true
    }
  }


  return {
    props: {
      receita,
    }
  }
}
