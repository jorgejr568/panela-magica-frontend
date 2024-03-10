import {Inter} from "next/font/google";
import {Footer, Main, Navbar} from "@/components";
import {Receita, ReceitasAPI} from "@/API";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import Head from "next/head";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {Toaster} from "@/components/ui/sonner";
import {ModalDelecao, useModalDelecao} from "@/components/ModalDelecao";
import {AuthSession, getAuthServerSideProps} from "@/utils/getAuthServerSideProps";

const inter = Inter({subsets: ["latin"]});

type HomeProps = { receitas: Receita[], session: AuthSession };

export default function Home({receitas: initialReceitas, session}: HomeProps) {
  const [receitas, setReceitas] = useState(initialReceitas);
  const modalDelecao = useModalDelecao();
  const afterExcluir = (receita: Receita) => {
    setReceitas(receitas.filter((r) => r.id !== receita.id));
  };

  return (
    <>
      <Head>
        <title>Panela Mágica</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar user={session.user}/>

        <Main>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
            As melhores receitas para você
          </h1>

          <section className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {receitas.map((receita) => (
              <Card key={receita.id}>
                <CardHeader className="p-0 overflow-hidden">
                  <Image
                    src={receita.imagem}
                    width="400"
                    height="225"
                    alt="Roasted Chicken"
                    className="aspect object-cover w-full"
                    style={{aspectRatio: "400/225", objectFit: "cover"}}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 py-2 px-4">
                    <h2 className="text-2xl font-semibold leading-none">
                      {receita.nome}
                    </h2>
                    <p className="text-sm/relaxed">por {receita.criador.nome}</p>
                    <p className="text-sm/relaxed text-slate-500">
                      {humanReadableInterval(receita.data_de_criacao)}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex justify-between w-full gap-2">
                    {session.user && (
                      <Button
                        variant="secondary"
                        onClick={() => modalDelecao.openModal(receita)}
                      >
                        <TrashIcon className="h-4 w-4"/>
                      </Button>
                    )}
                    <Link href={`/receitas/${receita.id}`} className='ml-auto'>
                      <Button variant="outline">Ver Receita</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </section>
        </Main>
        <Toaster/>
        <Footer/>
      </div>

      {session.user && <ModalDelecao
          afterDelete={afterExcluir}
          isOpen={modalDelecao.isOpen}
          onOpenChange={modalDelecao.closeModal}
          receita={modalDelecao.receita as Receita}
      />}
    </>
  );
}


export const getServerSideProps = getAuthServerSideProps<HomeProps>(async (_, session) => {
  const receitas = await ReceitasAPI.listar();
  return {props: {receitas, session}};
}, {allowUnauthenticated: true});
