"use client";

import { useEffect, useState } from "react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled: boolean;
}

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  disabled,
}: QuantitySelectorProps) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    onQuantityChange(parsedValue);
    setInputValue(parsedValue.toString());
  };

  return (
    <div className="flex w-full mb-2">
      <div className="flex w-full bg-gray-100 rounded-lg overflow-hidden">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={disabled || quantity <= 1}
          className="w-10 md:w-12 h-8 md:h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <span className="text-lg font-medium text-gray-600">−</span>
        </button>

        <div className="flex-1 relative">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full h-full text-center bg-transparent border-none focus:outline-none text-sm md:text-base font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={disabled}
            aria-label="Quantity"
          />
        </div>

        <button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={disabled}
          className="w-10 md:w-12 h-8 md:h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <span className="text-lg font-medium text-gray-600">+</span>
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
