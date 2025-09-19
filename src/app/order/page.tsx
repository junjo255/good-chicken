import StepperMain from "@/app/components/Order/Stepper/StepperMain";

export default async function OrderPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ lcn?: string }>;
}) {
    const { lcn } = await searchParams;

    return (
        <section
            style={{ maxWidth: "1200px" }}
            className="mx-auto space-y-4 py-10 mt-[var(--header-h)]"
        >
            <StepperMain initialLcn={lcn ?? null} />
        </section>
    );
}
