import localFont from "next/font/local";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default function Success(){

    return (
        <div className="bg-[url('/Imagens/BackgroundStyle.png')] w-screen h-screen">
            <div className="absolute top-[30%] left-[50%] flex flex-col items-center translate-[-50%] bg-white w-[600px] h-[300px] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
                <div className="h-[40%] flex flex-col items-center justify-center">
                    <p className="font-[Montserrat] text-[var(--darkPink-Pastel)] text-3xl w-fit mt-[10%]">Pagamento recusado!</p>
                </div>
            </div>
        </div>
    );
}