import React from "react";

import PayoneerImage from "@/images/payoneer.png";
import VisaImage from "@/images/visa.png";
import MasterCardImage from "@/images/mastercard.png";
import KlarnaImage from "@/images/klarna.png";
import PaypalImage from "@/images/paypal.png";
import Image from "next/image";

export default function AcceptedPayments() {
  return (
    <>
      <div className="grid gap-2 grid-cols-5">
        {[
          { image: VisaImage, alt: "Visa Card" },
          { image: PaypalImage, alt: "Paypal" },
          { image: MasterCardImage, alt: "MasterCard" },
          { image: PayoneerImage, alt: "Payoneer" },
          { image: KlarnaImage, alt: "Klarna" },
        ].map((payment) => (
          <span
            key={payment.alt}
            className="border border-gray-300 px-3 py-2 rounded-md flex justify-center items-center"
          >
            <Image
              src={payment.image}
              alt={payment.alt}
              width={48}
              height={48}
              style={{
                objectFit: "contain",
              }}
              loading="lazy"
              placeholder="blur"
            />
          </span>
        ))}
      </div>
    </>
  );
}
