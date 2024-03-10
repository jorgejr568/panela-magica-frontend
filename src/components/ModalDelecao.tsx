import {Receita, ReceitasAPI} from "@/API";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {useState} from "react";
import {toast} from "sonner";

type ModalDelecaoProps = {
  receita: Receita;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  afterDelete?: (receita: Receita) => void;
};

export const ModalDelecao = (props: ModalDelecaoProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleExcluir =
    (receita: Receita) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsDeleting(true);

      try {
        await ReceitasAPI.deletar(receita.id);
        toast.success("Receita excluída com sucesso");

        props.afterDelete && props.afterDelete(receita);
      } catch (e) {
        toast.error("Erro ao excluir a receita");
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <AlertDialogContent className="max-w-18rem lg:max-w-[40rem]">
        <AlertDialogHeader>
          Deseja realmente excluir a receita?
        </AlertDialogHeader>
        <AlertDialogDescription>
          <p>
            Esta ação é irreversível e excluirá permanentemente a receita do
            Panela Mágica.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleExcluir(props.receita)}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const useModalDelecao = () => {
  const [receita, setReceita] = useState<Receita | null>(null);

  const openModal = (receita: Receita) => setReceita(receita);
  const closeModal = () => setReceita(null);

  return {
    isOpen: !!receita,
    openModal,
    closeModal,
    receita,
  };
};
