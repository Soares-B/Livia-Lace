import getAddress from "@/lib/address";
import CPFform from "@/components/userCPF"

export async function CPF(){
    const address = await getAddress();

    return (
        <CPFform cpf={address!.cpf}/>
    );
}