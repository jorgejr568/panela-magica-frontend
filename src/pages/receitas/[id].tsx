import {Receita, ReceitasAPI, TIPOS_DE_RECEITA} from "@/API/receita";
import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import {Footer, Main, Navbar} from "@/components";
import Markdown from "react-markdown";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useRef, useState} from "react";
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Head from "next/head";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Form, FormField} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import dynamic from "next/dynamic";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";

const atualizarReceitaSchema = z.object({
  criador: z.string({
    required_error: "O nome do criador é obrigatório"
  }).min(3, {
    message: "O nome do criador deve ter no mínimo 3 caracteres"
  }).max(50, {message: "O nome do criador deve ter no máximo 50 caracteres"}),
  tipo: z.enum(TIPOS_DE_RECEITA, {
    required_error: "O tipo da receita é obrigatório",
  }),
  imagem: z.any({})
    .refine((file) => file instanceof File || !file, {
      message: "A imagem precisa ser preenchida",
    })
    .refine((file) => !(file instanceof File) || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type), {
      message: "A imagem deve ser do tipo jpeg, jpg ou png"
    })
    .refine((file) => !(file instanceof File) || file.size <= 2 * 1024 * 1024, {
      message: "A imagem deve ter até 2mb"
    })
    .optional(),
  ingredientes: z.array(z.object({
    nome: z.string().min(3, {message: "O nome do ingrediente deve ter no mínimo 3 caracteres"}).max(100, {message: "O nome do ingrediente deve ter no máximo 50 caracteres"}),
    quantidade: z.string().min(1, {message: "A quantidade do ingrediente deve ter no mínimo 1 caractere"}).max(50, {message: "A quantidade do ingrediente deve ter no máximo 20 caracteres"})
  }), {
    required_error: "Deve haver pelo menos um ingrediente"
  }).min(1, {message: "Deve haver pelo menos um ingrediente"}).max(50, {message: "Deve haver no máximo 50 ingredientes"}),
  modo_de_preparo: z.string({
    required_error: "O modo de preparo é obrigatório"
  }).min(10, {
    message: "O modo de preparo deve ter no mínimo 30 caracteres"
  }).max(2048, {message: "O modo de preparo deve ter no máximo 2048 caracteres"}),
  nome: z.string({
    required_error: "O nome da receita é obrigatório"
  }).min(3, {
    message: "O nome da receita deve ter no mínimo 3 caracteres"
  }).max(50, {message: "O nome da receita deve ter no máximo 50 caracteres"})
})

type EditarReceitaForm = z.infer<typeof atualizarReceitaSchema>

const Editor = dynamic(() => import('@/components/Editor'), {ssr: false})

type PaginaReceitaUnicaProps = { receita: Receita }
export default function PaginaReceitaUnica({receita: initialReceita}: PaginaReceitaUnicaProps) {
  const [receita, setReceita] = useState(initialReceita)
  const [editarAberto, setEditarAberto] = useState(false)
  const editarImagemRef = useRef<HTMLInputElement>(null)
  const form = useForm<EditarReceitaForm>({
    defaultValues: {
      criador: receita.criador,
      tipo: receita.tipo as typeof TIPOS_DE_RECEITA[number],
      imagem: '',
      ingredientes: receita.ingredientes,
      modo_de_preparo: receita.modo_de_preparo,
      nome: receita.nome
    }
  })

  const adicionarIngrediente = () => {
    form.setValue('ingredientes', [...form.getValues('ingredientes'), {nome: '', quantidade: ''}])
  }

  const removerIngrediente = (index: number) => {
    form.setValue('ingredientes', form.getValues('ingredientes').filter((_, i) => i !== index))
  }

  const handleSalvar = async (data: EditarReceitaForm) => {
    const result = atualizarReceitaSchema.safeParse({
      ...data,
      imagem: editarImagemRef.current?.files?.[0]
    })
    if (!result.success) {
      const uniqueErrorMessages = new Set(result.error.issues.map((issue) => issue.message))
      uniqueErrorMessages.forEach((message) => toast.error(message))
      return
    }

    const imagem = editarImagemRef.current?.files?.[0]
    let novaImagemUrl = receita.imagem
    if (imagem) {
      novaImagemUrl = await ReceitasAPI.salvarImagem(imagem)
    }

    const novaReceita = {
      ...result.data,
      imagem: novaImagemUrl
    }

    const receitaAtualizada = await ReceitasAPI.atualizar(receita.id, novaReceita)

    toast.success('Receita atualizada com sucesso')

    setReceita({
      ...receitaAtualizada,
      imagem: imagem ? URL.createObjectURL(imagem) : novaImagemUrl
    })

    form.resetField('imagem')
    setEditarAberto(false)
  }

  return (
    <>
      <Head>
        <title>{receita.nome} | Panela Mágica</title>
      </Head>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar/>

          <Main className="grid lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2 order-2 md:order-1">
              <div className="flex items-center gap-8">
                <h1
                  className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
                  {receita.nome}
                </h1>

                <Tooltip>
                  <TooltipTrigger>
                    <PencilSquareIcon
                      className="h-6 w-6 text-gray-400 dark:text-gray-400 cursor-pointer self-start"
                      onClick={() => setEditarAberto(true)}
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <Image
                    alt={`Imagem do criador ${receita.criador}`}
                    className="rounded-full"
                    height={50}
                    src={`/cozinheiros/cozinheiro-${(receita.id % 4) + 1}.jpeg`}
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

          <Sheet open={editarAberto} onOpenChange={setEditarAberto} modal>
            <SheetContent className='w-full sm:max-w-full lg:max-w-1/2'>
              <SheetHeader>
                <SheetTitle>Editando receita #{receita.id}</SheetTitle>
                <SheetDescription>
                  As alterações feitas aqui não serão salvas automaticamente. Clique em "Salvar" para confirmar as
                  alterações.

                  <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleSalvar)} className='grid gap-4 mt-8 border'>
                      <ScrollArea className='max-h-[65vh] lg:max-h-[72vh] xl:max-h-[80vh]'>
                        <div className="px-4 py-2 space-y-4">
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({field}) => (
                              <div>
                                <Label htmlFor="nome">Nome</Label>
                                <Input id="nome" type="text" placeholder="Nome da receita" {...field}/>
                              </div>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="criador"
                            render={({field}) => (
                              <div>
                                <Label htmlFor="criador">Criador</Label>
                                <Input id="criador" type="text" placeholder="Seu nome" {...field}/>
                              </div>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="tipo"
                            render={({field}) => (
                              <div>
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select value={form.watch('tipo')}
                                        onValueChange={(value) => form.setValue('tipo', value as any)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Selecione o tipo da receita'/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIPOS_DE_RECEITA.map((tipo) => (
                                      <SelectItem key={tipo} value={tipo}>{tipo.toUpperCase()}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="imagem"
                            render={({field}) => (
                              <div>
                                <Label htmlFor="imagem">Imagem</Label>
                                <Input id="imagem" type="file" {...field} ref={editarImagemRef}/>
                              </div>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="ingredientes"
                            render={({field}) => (
                              <div>
                                <Label>Ingredientes</Label>
                                <div className='grid gap-4 my-4'>
                                  {form.watch('ingredientes').map((ingrediente, index) => {
                                    return <div key={index} className='grid gap-y-4 gap-x-2 grid-cols-4'>
                                      <Input type='text'
                                             className='col-span-2'
                                             placeholder='Nome do ingrediente' {...form.register(`ingredientes.${index}.nome`)}/>
                                      <Input type='text'
                                             placeholder='Quantidade' {...form.register(`ingredientes.${index}.quantidade`)}/>

                                      {index > 0 && <Button variant='outline' onClick={() => removerIngrediente(index)}>
                                          <TrashIcon className='h-4 w-4'/>
                                      </Button>}
                                    </div>
                                  })}
                                </div>

                                <div className="flex justify-end">
                                  <Button variant='secondary' onClick={adicionarIngrediente}>
                                    Adicionar ingrediente
                                  </Button>
                                </div>
                              </div>
                            )}
                          />

                          <div>
                            <Label htmlFor="modo_de_preparo">Modo de preparo</Label>
                            <Editor
                              markdown={form.watch('modo_de_preparo')}
                              onChange={(value) => form.setValue('modo_de_preparo', value)}
                            />
                          </div>
                        </div>
                      </ScrollArea>
                    </form>
                  </Form>
                </SheetDescription>

                <SheetFooter>
                  <Button variant='secondary' onClick={() => setEditarAberto(false)}>Cancelar</Button>
                  <Button onClick={form.handleSubmit(handleSalvar)}>Salvar</Button>
                </SheetFooter>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Footer/>
        </div>

        <Toaster/>
      </TooltipProvider>
    </>
  )
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
