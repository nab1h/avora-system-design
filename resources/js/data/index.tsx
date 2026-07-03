

const { translate } = useLanguage();
// navbar data
export const navbar = [
    {
        href: "#home",
        name: translate({ ar: "الرئسية", en: "Home" }),
    },

    {
        href: "#cards",
        name: translate({ ar: "الكروت", en: "Cards" }),
    },

    {
        href: "#dashboard",
        name: translate({ ar: "الداشبورد", en: "Dashboard" }),
    },

    {
        href: "#backgrounds",
        name: translate({ ar: "الخلفيات", en: "Backgrounds" }),
    },
];
function useLanguage(): { translate: any; } {
    throw new Error("Function not implemented.");
}

