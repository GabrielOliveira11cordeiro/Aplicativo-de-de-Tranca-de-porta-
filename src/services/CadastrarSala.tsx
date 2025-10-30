import { doc, getFirestore, setDoc } from "firebase/firestore";

interface CadastrarSalaData {
    nomeSala: string;
    descricao: string;
    salaacessolevel: string;
}
export const cadastrarSala = async (data: CadastrarSalaData) => {
    try {
        const db = getFirestore();
        const salaRef = doc(db, "salas", data.nomeSala);
        await setDoc(salaRef, {
            nomeSala: data.nomeSala,
            descricao: data.descricao,
            salaacessolevel: data.salaacessolevel,
            createdAt: new Date(),
        });
        console.log("Sala cadastrada com sucesso!");
        return {sucess: true};
    } catch (error) {
        sucess: false
        console.error("Erro ao cadastrar sala: ", error);
        return {sucess: false};
    }
};
