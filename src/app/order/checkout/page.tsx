"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  CalendarDays,
  Info,
} from "lucide-react";

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border-[#f3f3f3] bg-white shadow-xl ${className}`}>{children}</div>;
}
function SectionTitle({ children }: React.PropsWithChildren) {
  return <div className="text-[15px] font-medium text-neutral-900">{children}</div>;
}
function Row({
               icon: Icon,
               title,
               subtitle,
               action = "Edit",
               actionAlt,
             }: {
  icon: any;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: string;
  actionAlt?: React.ReactNode;
}) {
  return (
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="h-[18px] w-[18px] text-neutral-700" />
          </div>
          <div>
            <div className="text-[15px] font-medium text-neutral-900">{title}</div>
            {subtitle && <div className="mt-0.5 text-sm text-neutral-600">{subtitle}</div>}
          </div>
        </div>
        <button className="text-sm font-medium text-neutral-700 hover:text-black">
          {actionAlt ?? action}
        </button>
      </div>
  );
}
function Line() {
  return <div className="h-px w-full bg-neutral-200" />;
}
function PriceRow({
                    label,
                    value,
                    muted = false,
                    negative = false,
                    info = false,
                  }: {
  label: string;
  value: string;
  muted?: boolean;
  negative?: boolean;
  info?: boolean;
}) {
  return (
      <div className="flex items-center justify-between py-2 text-[15px]">
        <div className={`flex items-center gap-1 ${muted ? "text-neutral-600" : "text-neutral-800"}`}>
          <span>{label}</span>
          {info && <Info className="h-4 w-4 text-neutral-400" />}
        </div>
        <div className={`${negative ? "text-[#1A8F3D]" : "text-neutral-800"}`}>{value}</div>
      </div>
  );
}

export default function CheckoutPickupOnly() {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
      <section
          style={{
            marginTop: "var(--header-h, 96px)",
            scrollMarginTop: "var(--header-h, 96px)",
          }}
          className="min-h-screen w-full"
      >
        {/* Top bar */}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black">
            <ArrowLeft className="h-4 w-4" /> Back to order
          </button>
          <div className="text-lg font-semibold tracking-tight">Pickup Checkout</div>
          <div className="w-[92px]" /> {/* spacer */}
        </div>

        {/* Content */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-12 md:grid-cols-3">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {/* Pickup Details */}
            <Card>
              <div className="flex items-center justify-between p-5">
                <div className="text-[17px] font-semibold">Pickup details</div>
              </div>

              <Line />

              {/* Store address */}
              <Row
                  icon={MapPin}
                  title={
                    <>
                      <div>414 Grand St</div>
                      <div className="text-sm text-neutral-600">Jersey City, NJ 07302</div>
                    </>
                  }
              />
              <Line />

              <div className="p-4">
                <SectionTitle>Pickup time</SectionTitle>
                <div className="mt-3 rounded-xl border">
                  <button className="flex w-full items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-neutral-700" />
                      <span className="text-[15px] font-medium text-neutral-800">ASAP</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Payment */}
            <Card>
              <div className="p-4">
                <div className="text-[15px] font-semibold">Payment</div>
              </div>
              <Line />
              <Row
                  icon={CreditCard}
                  title={
                    <>
                      <div className="font-medium">Personal</div>
                      <div className="text-sm text-neutral-600">Visa —••••1681</div>
                    </>
                  }
              />
            </Card>

            {/* Primary CTA */}
            <button className="w-full rounded-lg bg-[#AF3935] py-3 text-center text-[15px] font-semibold text-white cursor-pointer">
              Next
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* Store summary */}
            <Card>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-neutral-200" />
                    <div>
                      <div className="text-[15px] font-semibold">Good Chicken</div>
                      <div className="text-sm text-neutral-600">414 Grand st Jersey City, NJ 07302</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </div>

                <button
                    onClick={() => setSummaryOpen((s) => !s)}
                    className="mt-4 flex w-full items-center justify-between rounded-xl border p-3 text-left"
                >
                  <div className="text-[15px] font-medium">Cart summary</div>
                  {summaryOpen ? (
                      <ChevronUp className="h-4 w-4 text-neutral-500" />
                  ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                  )}
                </button>

                <button className="mt-4 w-full rounded-lg bg-[#AF3935] py-3 text-center text-[15px] font-semibold text-white cursor-pointer">
                  Next
                </button>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="text-[15px] font-semibold">Order total</div>
                <div className="mt-2">
                  <PriceRow label="Subtotal" value="$18.25" />
                  <PriceRow label="Taxes" value="$1.46" info muted />
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4 text-[15px]">
                  <div className="font-semibold">Total</div>
                  <div className="font-semibold">$19.71</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
  );
}
