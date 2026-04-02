"use client";

import { useState } from "react";
import type { Car } from "@/types/cars";
import RentalPolicyModal from "./RentalPolicyModal";

interface Props {
  car: Car;
  carName: string;
  label: string;
}

export default function RentalPolicyButton({ car, carName, label }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="rental-conditions__policy-btn"
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>
      <RentalPolicyModal
        car={car}
        carName={carName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
