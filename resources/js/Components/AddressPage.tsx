import { CardMeta } from "@/avora-dash/components/Card/CardMeta";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";

interface IProps {
    supAddress: string;
    address: string;
}
export function AddressPage({ supAddress, address }: IProps) {
    const { direction } = useLanguage();

    return (
        <>
            <div>
                <h2
                    className={`mt-1 text-2xl font-bold text-center ${
                        direction === "ltr" ? "font-roboto" : " "
                    }`}
                >
                    {address}
                </h2>
                <CardMeta>{supAddress}</CardMeta>
            </div>
        </>
    );
}
