import StepperMain from "@/app/components/Order/Stepper/StepperMain";

export default function OrderPage({
                                      searchParams,
                                  }: { searchParams: { lcn?: string } }) {
    return (
        <section
            style={{ maxWidth: "1200px" }}
            className="mx-auto space-y-4 py-10 mt-[var(--header-h)]"
        >
            <StepperMain initialLcn={searchParams.lcn ?? null} />
        </section>
    );
}