import { CardMeta } from "@/avora-dash/components/Card";

interface IProps {
    supAddress: string;
    address: string;
}
export function AddressPage({supAddress,address}:IProps) {
    return (
        <>
            <div>
                <CardMeta>{supAddress}</CardMeta>
                <h2 className="mt-1 text-2xl font-bold">
                    {address}
                </h2>
            </div>
        </>
    );
}
