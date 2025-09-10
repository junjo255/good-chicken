"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  DoorOpen,
  CreditCard,
  CalendarDays,
  Clock,
  Info,
  Tag,
} from "lucide-react";


function PillToggle({ value, onChange }: { value: "delivery" | "pickup"; onChange: (v: "delivery" | "pickup") => void }) {
  return (
      <div className="inline-flex rounded-full border bg-white p-1 text-sm font-medium shadow-sm">
        {(["delivery", "pickup"] as const).map((opt) => (
            <button
                key={opt}
                onClick={() => onChange(opt)}
                className={
                    `px-4 py-1 rounded-full transition ` +
                    (value === opt ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100")
                }
            >
              {opt === "delivery" ? "Delivery" : "Pickup"}
            </button>
        ))}
      </div>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
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
            {subtitle && (
                <div className="mt-0.5 text-sm text-[#00A36C]">{subtitle}</div>
            )}
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

function PriceRow({ label, value, muted = false, negative = false, info = false }: {
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

export default function UberCheckoutMock() {
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [tip, setTip] = useState<number>(12);
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
      <div className="min-h-screen w-full bg-neutral-100">
        {/* Top bar */}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black">
            <ArrowLeft className="h-4 w-4" /> Back to store
          </button>
          <div className="text-lg font-semibold tracking-tight">Uber Eats</div>
          <div className="w-[92px]" /> {/* spacer */}
        </div>

        {/* Content */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-12 md:grid-cols-3">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {/* Details Card */}
            <Card>
              <div className="flex items-center justify-between p-5">
                <div className="text-[17px] font-semibold">{mode === "delivery" ? "Delivery details" : "Pickup Details"}</div>
                <PillToggle value={mode} onChange={setMode} />
              </div>
              {/* Map banner shown for pickup */}
              {mode === "pickup" && (
                  <div className="mx-5 mb-4 overflow-hidden rounded-xl bg-neutral-200">
                    {/* Simple map-like SVG */}
                    <svg viewBox="0 0 600 180" className="h-40 w-full">
                      <rect width="600" height="180" fill="#e7e7e7" />
                      <path d="M80 140 C 160 70, 260 140, 340 80 S 520 130, 560 60" stroke="#1f2937" strokeWidth="6" fill="none" strokeLinecap="round" />
                      <circle cx="80" cy="140" r="10" fill="white" stroke="#1f2937" strokeWidth="6" />
                      <rect x="540" y="40" width="20" height="20" rx="4" fill="#1f2937" />
                    </svg>
                  </div>
              )}
              <Line />
              <Row
                  icon={MapPin}
                  title={<>
                    <div>15 E Midland Ave</div>
                    <div className="text-sm text-neutral-600">Paramus, NJ</div>
                  </>}
              />
              <Line />
              <Row
                  icon={DoorOpen}
                  title={<div>Meet at my door</div>}
                  subtitle={<span className="cursor-pointer hover:underline">Add delivery instructions</span>}
              />
              <Line />
              <div className="p-4">
                <SectionTitle>Delivery options</SectionTitle>
                <div className="mt-3 rounded-xl border">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-neutral-700" />
                      <div>
                        <div className="text-[15px] text-neutral-900">Standard</div>
                        <div className="text-sm text-neutral-500">Currently closed</div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </div>
                </div>
                {/* Schedule row */}
                <div className="mt-3 rounded-xl border">
                  <button className="flex w-full items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-neutral-700" />
                      <span className="text-[15px] font-medium text-neutral-800">Schedule</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Payment Card */}
            <Card>
              <div className="p-4">
                <div className="text-[15px] font-semibold">Payment</div>
              </div>
              <Line />
              <Row
                  icon={CreditCard}
                  title={<>
                    <div className="font-medium">Personal</div>
                    <div className="text-sm text-neutral-600">Uber Cash: $0.00 + Visa —••••1681</div>
                  </>}
              />
            </Card>

            {/* Primary CTA */}
            <button className="w-full rounded-lg bg-black py-3 text-center text-[15px] font-semibold text-white">Next</button>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <Card>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-neutral-200" />
                    <div>
                      <div className="text-[15px] font-semibold">Chipotle Mexican Grill</div>
                      <div className="text-sm text-neutral-600">545 Route 17 South</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl border p-3">
                  <Tag className="mt-0.5 h-4 w-4 text-[#C27803]" />
                  <div className="text-sm text-neutral-800">
                    Save an extra <span className="font-semibold">$3.50</span> on this order
                    <div className="text-neutral-600">with Uber One</div>
                    <div className="mt-1 text-xs text-neutral-500">Free for 5 months then $9.99/mo</div>
                  </div>
                  <input type="checkbox" className="ml-auto mt-1 h-4 w-4 accent-black" />
                </div>

                <button className="mt-4 w-full rounded-lg bg-black py-3 text-center text-[15px] font-semibold text-white">Next</button>
              </div>
            </Card>

            <Card>
              <button onClick={() => setSummaryOpen((s) => !s)} className="flex w-full items-center justify-between p-4 text-left text-[15px] font-medium">
                <div className="flex items-center gap-2">
                  <span>Cart summary</span>
                  <span className="text-neutral-500">(1 item)</span>
                </div>
                {summaryOpen ? (
                    <ChevronUp className="h-4 w-4 text-neutral-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between text-[15px] font-medium">
                  <span>Promotion</span>
                  <span className="text-neutral-600">1 promotion available</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="text-[15px] font-semibold">Order total</div>
                <div className="mt-2">
                  <PriceRow label="Subtotal" value="$18.25" />
                  <PriceRow label="Delivery Fee" value="$1.49" info muted />
                  <PriceRow label="Taxes & Other Fees" value="$4.82" info muted />
                  <PriceRow label="Delivery Discount" value="-$1.49" negative />
                </div>

                <div className="mt-3 text-sm text-neutral-700">
                  <div className="font-medium">Add a tip <span className="float-right font-semibold">$2.94</span></div>
                  <div className="text-[13px] text-neutral-600 clear-both">
                    They make delivery possible—no matter what time it is
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {[8, 12, 16, 20].map((v) => (
                      <button
                          key={v}
                          onClick={() => setTip(v)}
                          className={`rounded-full border px-3 py-1 text-sm font-medium ` +
                              (tip === v ? "bg-black text-white" : "hover:bg-neutral-100")}
                      >
                        {v}%
                      </button>
                  ))}
                  <button className="rounded-full border px-3 py-1 text-sm font-medium hover:bg-neutral-100">Other</button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4 text-[15px]">
                  <div className="font-semibold">Total</div>
                  <div className="font-semibold">$26.01</div>
                </div>

                <p className="mt-4 text-[11px] leading-5 text-neutral-500">
                  If you’re not around when the delivery person arrives, they’ll leave your order at the door. By placing your order, you agree to take full responsibility for it once it’s delivered. Orders containing alcohol or other restricted items may not be eligible for leave at door and will be returned to the store if you are not available.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}
