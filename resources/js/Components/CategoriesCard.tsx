


interface IProps{
    name: string;
    src: string;
}
export function CategoriesCard({name,src}:IProps){

    return (
        <div className="w-full object-cover">
            <div className="">
                {name}
            </div>
        </div>
    );

}
