import Image from "next/image";
import {Receita} from "@/API";

type AvatarCriadorProps = {
  criador: Receita['criador']
}

export function AvatarCriador({criador}: AvatarCriadorProps) {
  return (
    <Image
      alt={`Imagem do criador ${criador.nome}`}
      className="rounded-full"
      height={50}
      src={`/cozinheiros/cozinheiro-${(criador.id % 4) + 1}.jpeg`}
      style={{
        aspectRatio: "40/40",
        objectFit: "cover",
      }}
      width={50}
    />
  )
}
