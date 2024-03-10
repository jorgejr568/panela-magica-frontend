import {Receita, ReceitasAPI} from "@/API";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import {Footer, Main, Navbar} from "@/components";
import Markdown from "react-markdown";
import {useState} from "react";
import {PencilSquareIcon} from '@heroicons/react/24/outline'
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Head from "next/head";
import {Toaster} from "@/components/ui/sonner";
import {AvatarCriador} from "@/components/AvatarCriador";
import {AuthSession, getAuthServerSideProps} from "@/utils/getAuthServerSideProps";
import {EditarReceitaSheet, useEditarReceitaSheet} from "@/components/EditarReceita";


type PaginaReceitaUnicaProps = { receita: Receita, session: AuthSession }

export default function PaginaReceitaUnica({receita: initialReceita, session}: PaginaReceitaUnicaProps) {
  const [receita, setReceita] = useState(initialReceita)
  const editarReceitaCtx = useEditarReceitaSheet(initialReceita, session.token)


  return (
    <>
      <Head>
        <title>{receita.nome} | Panela Mágica</title>
      </Head>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar user={session.user}/>

          <Main className="grid lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2 order-2 md:order-1">
              <div className="flex items-center gap-8">
                <h1
                  className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
                  {receita.nome}
                </h1>

                {session.user && (<Tooltip>
                  <TooltipTrigger>
                    <PencilSquareIcon
                      className="h-6 w-6 text-gray-400 dark:text-gray-400 cursor-pointer self-start"
                      onClick={() => editarReceitaCtx.onOpenChange(true)}
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>)}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <AvatarCriador criador={receita.criador}/>
                  <div className="text-sm font-medium">{receita.criador.nome}</div>
                </div>
                <div
                  className="text-sm font-medium text-gray-500 dark:text-gray-400">{humanReadableInterval(receita.data_de_criacao)}</div>
              </div>
              <div className="prose prose-gray max-w-none w-full flex flex-col gap-16">
                <div>
                  <h2
                    className="text-2xl font-bold tracking-tight sm:text-3xl md:tracking-tighter/[-.5] lg:text-4xl lg:tracking-normal">Ingredientes</h2>
                  <Table className='mt-4'>
                    <TableBody>
                      {receita.ingredientes.map((ingrediente, index) => {
                        return <TableRow key={index}>
                          <TableCell className="border">{ingrediente.nome}</TableCell>
                          <TableCell className="border">{ingrediente.quantidade}</TableCell>
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold tracking-tight sm:text-3xl md:tracking-tighter/[-.5] lg:text-4xl lg:tracking-normal">
                    Modo de preparo
                  </h2>

                  <Markdown className='prose mt-4'
                            allowedElements={['p', 'ol', 'ul', 'li', 'strong', 'i', 'span', 'em', 'u']}>
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
        {session.user && <EditarReceitaSheet {...editarReceitaCtx} afterSave={(receita) => setReceita(receita)}/>}
        <Toaster/>
      </TooltipProvider>
    </>
  )
}

export const getServerSideProps = getAuthServerSideProps<PaginaReceitaUnicaProps>(async ({params}, session) => {
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
      session
    }
  }
}, {allowUnauthenticated: true})
