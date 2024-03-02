type Ingrediente = {
  nome: string
  quantidade: string
}

export type Receita = {
  id: number
  nome: string
  criador: string
  ingredientes: Ingrediente[]
  modo_de_preparo: string
  imagem: string
  data_de_criacao: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const ReceitasAPI = {
  listar: async (): Promise<Receita[]> => {
    const data = await fetch(`${BASE_URL}/receitas`)
    if (!data.ok) {
      throw new Error('Erro ao buscar as receitas')
    }


    return data.json()
  },
  buscar: async (id: number): Promise<Receita | null> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`)
    if (!data.ok) {
      throw new Error('Erro ao buscar a receita')
    }

    return data.json()
  }
}
