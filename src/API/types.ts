type Ingrediente = {
  nome: string
  quantidade: string
}

export const TIPOS_DE_RECEITA = [
  'doce',
  'sopa',
  'massa',
  'salada',
  'carnes',
  'peixes',
  'bebidas',
  'lanches',
  'pães',
  'bolos',
  'tortas',
  'sobremesas',
  'salgado',
  'outros'
] as const

export type Receita = {
  id: number
  nome: string
  tipo: typeof TIPOS_DE_RECEITA[number] | (string & {})
  criador: {
    id: number
    nome: string
  }
  ingredientes: Ingrediente[]
  modo_de_preparo: string
  imagem: string
  data_de_criacao: number
}


export type User = {
  id: number
  name: string
  email: string
  username: string
  created_at: number
}
