import { Button } from "@/avora-dash/components/Button";
import { Card } from "@/avora-dash/components/Card/Card";
import { CardFooter } from "@/avora-dash/components/Card/CardFooter";
import { CardTitle } from "@/avora-dash/components/Card/CardTitle";
import { GridItem } from "@/avora-dash/components/Grid";
import { Grid } from "@/avora-dash/components/Grid/Grid";
import { Modal } from "@/avora-dash/components/Modal/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Attribute, PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export const AttrbutePage = () => {
    const page = usePage<PageProps>();
    const attributes = page.props.attributes as Attribute[];
    const { language, translate } = useLanguage();
    const [openModel, setOpenModel] = useState(true);
    return (
        <section className="space-y-5">
            <Grid layout="cards" width="full">
                <GridItem span="one">
                    <article>
                        {attributes.map((item) => (
                            <Card variant="outlined" rounded="md" key={item.id}>
                                <CardTitle className="flex align-center">
                                    {item.name}
                                </CardTitle>
                                <CardFooter>
                                    <Grid layout="two" gap="md" padding="none">
                                        <GridItem>
                                            <Button variant="primary" fullWidth>
                                                Edit
                                            </Button>
                                        </GridItem>
                                        <GridItem>
                                            <Button variant="danger" fullWidth>
                                                Delete
                                            </Button>
                                        </GridItem>
                                    </Grid>
                                </CardFooter>
                            </Card>
                        ))}
                    </article>
                </GridItem>
                <GridItem span="one">
                    <article></article>
                </GridItem>
            </Grid>
            <Modal
                open={openModel}
                onClose={() => {
                    setOpenModel(false);
                }}
                title={translate({
                    ar: "إضافة خاصية منتج",
                    en: "Add Product Attrboute",
                })}
            >
                <h1>add attributes</h1>
            </Modal>
        </section>
    );
};
